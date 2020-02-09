import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { createClient } from 'medea';
import fetchPage from '../readCachedFile';
import Enums from '../enums';
import { checkImgForVariant } from '../processors';
import Mappers from '../mappers';
import { constructPokedex } from '../../src/data';

const writeAsync = promisify(fs.writeFile);

const POKEMON = 'pokemon';
const POKEMON_URL =
  'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_National_Pokédex_number';

const scrapeTargets = ['sprites', 'art'];

type MissingEntry = {
  npn: number;
  name: string;
  isVariant: boolean;
  variantRegion: number;
  sprite: string;
  art: string;
  filename: string;
  reasons?: string[];
};

export default function filterFalsey<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

async function validate(fn: () => Promise<boolean>, message: () => void) {
  const passed = await fn();
  if (!passed) {
    message();
    process.exit(0);
  }
}

async function run() {
  const windowColumns = process.stdout.columns || 80;

  const cli = createClient('Image scraper!', { windowColumns })
    .addOption({
      option: 'key',
      shortcut: 'k',
      description: `Image scrape target, either "sprites" or "art"`,
      validate: (_, value: string) => scrapeTargets.includes(value)
    })
    .parse(process.argv)
    .welcome();

  if (!cli.any() || !cli.has('key')) {
    // TODO
    // Medea make the ability to enfore required props
    cli.helpText();
    process.exit(0);
  }

  const imageFolder = cli.get('key');

  await validate(
    async () => cli.validate('key'),
    () =>
      console.log(`
        Invalid args supplied to image export (${imageFolder}).
        Expected "sprites" or "art"`)
  );

  const $ = await fetchPage(POKEMON, POKEMON_URL);

  const tables = Array.from($('table > tbody')).slice(
    Enums.TABLE_COUNT_OFFSET,
    Enums.GENERATION_COUNT + Enums.TABLE_COUNT_OFFSET
  );

  const items = tables
    .reduce<(MissingEntry | null)[]>(
      (result, data) => [
        ...result,
        ...Array.from(data.children).map((tr) => {
          const children = $(tr).children();

          if (!children) {
            return null;
          }

          const variantRegion =
            (!children
              .first()
              .text()
              .trim() &&
              checkImgForVariant(children.eq(2))) ||
            0;

          const isVariant = variantRegion !== 0;
          const tdNPN = children.eq(1);
          const td = children.eq(2);
          const img = td
            .children()
            .first()
            .children()
            .first();

          const npn = Mappers.processTdNPN(tdNPN);
          const name = img.attr('alt') ?? '';
          const src = img.attr('src') ?? '';

          if (!npn) {
            return null;
          }

          const variantKey = Object.keys(Enums.Regions).find(
            (key) => Enums.Regions[key] === variantRegion
          );

          const artUrlPart = `${npn}${name}${
            isVariant ? `-${variantKey}` : ''
          }`;

          return {
            npn,
            name,
            isVariant,
            variantRegion,
            sprite: `https:${src}`,
            art: `https://bulbapedia.bulbagarden.net/wiki/File:${artUrlPart}.png`,
            filename: `${npn}${isVariant ? `_r${variantRegion}` : ''}`
          };
        })
      ],
      []
    )
    .filter(filterFalsey);

  const { pokedex } = constructPokedex();
  const currentItems = Array.from<{ id: string }>(pokedex.values()).filter(
    (x) => !x.id.startsWith('m')
  );

  const missing: MissingEntry[] = [];

  items.forEach((item) => {
    const reasons: string[] = [];
    const imagePath = path.join(__dirname, './', imageFolder, item.filename);

    if (!fs.existsSync(imagePath)) {
      reasons.push('Image does not exist');
    }

    const itemId = item.isVariant
      ? `v_${item.npn}${
          item.variantRegion > 7 ? `_r${item.variantRegion}` : ''
        }`
      : item.npn;

    if (!currentItems.find((x) => x.id === itemId)) {
      reasons.push("Current items doesn't contain the entry");
    }

    if (reasons.length) {
      missing.push({ ...item, reasons });
    }
  });

  const filename = path.join(__dirname, `./missing_${imageFolder}.json`);
  await writeAsync(filename, JSON.stringify(missing, null, 2));

  /* TODO
   *
   * Ask for user input (Y/N) which will:
   * (N) exit
   * (Y) download missing images into ./images/<name>
   */

  console.log(
    chalk.yellowBright(
      'The following counts do not include mega evolutions (48 as of Gen 8) or different base pokemon forms.'
    )
  );
  console.log(
    chalk.blue(
      `Of the ${items.length} Items processed, ${missing.length} were deemed missing.`
    )
  );

  console.log(chalk.blue('Finished successfully!'));

  process.exit(0);
}

run();
