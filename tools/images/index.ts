/* eslint-disable @typescript-eslint/require-await */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { ask } from 'stdio';
import { promisify } from 'util';
import stream from 'stream';
import got from 'got';

import { createClient } from 'medea';
import { constructPokedex } from '@src/data';

import fetchPage from '@/readCachedFile';
import Enums, { ImageScrapeTarget } from '@/enums';
import Mappers from '@/mappers';
import { checkImgForVariant, filterFalsey } from '@/utils';

const writeAsync = promisify(fs.writeFile);
const pipeline = promisify(stream.pipeline);

const POKEMON = 'pokemon';
const POKEMONDE = 'pokemon-de';

const POKEMON_URL =
  'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_National_Pokédex_number';
const POKEMONDE_URL = 'https://www.pokewiki.de/Pokémon-Liste';

const NO_IMAGE = 'Image does not exist';
const NO_ENTRY = 'Current items doesn\'t contain the entry';

const noes = ['no', 'n'];
const yeses = ['yes', 'y'];

type MissingEntry = {
  npn: number;
  name: string;
  isVariant: boolean;
  variantRegion: number;
  filename: string;
  reasons?: string[];
};

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
      description: 'Image scrape target, either "sprites" or "art"',
      validate: (_, value: string) =>
        Object.values<string>(ImageScrapeTarget).includes(value)
    })
    .parse(process.argv)
    .welcome();

  if (!cli.any() || !cli.has('key')) {
    // TODO
    // Medea make the ability to enfore required props
    cli.helpText();
    process.exit(0);
  }

  const imageFolder = cli.get('key') as string;

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
        ...Array.from($(data).children()).map((tr) => {
          const children = $(tr).children();

          if (!children) {
            return null;
          }

          const variantRegion =
            (!children.first().text().trim() &&
              checkImgForVariant(children.first())) ||
            0;

          const isVariant = variantRegion !== 0;
          const tdNPN = children.eq(0);
          const td = children.eq(1);
          const img = td.children().first().children().first();

          const npn = Mappers.processTdNPN(tdNPN);
          const paddedNpn = `${npn}`.padStart(4, '0');
          const name = img.attr('alt') ?? '';

          if (!npn) {
            return null;
          }

          return {
            npn,
            name,
            isVariant,
            variantRegion,
            filename: `${paddedNpn}${isVariant ? `_r${variantRegion}` : ''}.png`
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
      reasons.push(NO_IMAGE);
    }

    const vSuff = item.variantRegion > 7 ? `_r${item.variantRegion}` : '';
    const itemId = item.isVariant ? `v_${item.npn}${vSuff}` : `p_${item.npn}`;

    if (!currentItems.find((x) => x.id === itemId)) {
      reasons.push(NO_ENTRY);
    }

    if (reasons.length) {
      missing.push({ ...item, reasons });
    }
  });

  const filename = path.join(__dirname, `./missing_${imageFolder}.json`);
  await writeAsync(filename, JSON.stringify(missing, null, 2));

  if (missing.length) {
    // TODO
    // Refactor stdio code in medea
    const answer = await ask('Would you like to download missing images?', {
      options: [...yeses, ...noes],
      maxRetries: 2
    });

    if (yeses.includes(answer)) {
      if (imageFolder === ImageScrapeTarget.Art.toString()) {
        for (const item of missing) {
          const imageFilename = path.join(
            __dirname,
            `./${imageFolder}/${item.filename}`
          );

          const npn = `${item.npn}`.padStart(3, '0');
          const url = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${npn}.png`;
          await pipeline(got.stream(url), fs.createWriteStream(imageFilename));
        }
      } else if (imageFolder === ImageScrapeTarget.Sprites.toString()) {
        const $de = await fetchPage(POKEMONDE, POKEMONDE_URL);

        for (const item of missing) {
          const imageFilename = path.join(
            __dirname,
            `./${imageFolder}/${item.filename}`
          );

          const paddedNpn = `${item.npn}`.padStart(4, '0');
          const $cell = $de(`td:contains("${paddedNpn}")`);
          if (!$cell) {
            console.log(
              chalk.yellowBright(
                `Unable to find an element containing: ${paddedNpn}.`
              )
            );

            continue;
          }

          const $img = $cell.parent().find('img');
          if (!$img) {
            console.log(
              chalk.yellowBright(`Unable to find an img tag for: ${paddedNpn}.`)
            );

            continue;
          }

          const src = $img.attr('src');
          if (!src) {
            console.log(
              chalk.yellowBright(
                `Unable to find a src for the img tag for: ${paddedNpn}.`
              )
            );

            continue;
          }

          const url = path.join('https://www.pokewiki.de', src);
          await pipeline(got.stream(url), fs.createWriteStream(imageFilename));
        }
      }
    }
  }

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

void run();
