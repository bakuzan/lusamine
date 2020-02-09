import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import minimist from 'minimist';

import fetchPage from '../readCachedFile';
import Enums from '../enums';
import { checkImgForVariant } from '../processors';
import Mappers from '../mappers';
import { constructPokedex } from '../../src/data';

const argv = minimist(process.argv.slice(2));
const writeAsync = promisify(fs.writeFile);

const POKEMON = 'pokemon';
const POKEMON_URL =
  'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_National_Pokédex_number';

const scrapeTargets = ['sprites', 'art'];

async function run() {
  console.log(chalk.green('Image Scraper!'));

  if (argv.help) {
    console.log(`
         /* Example usage
          *
          * npm run scrape:image -- --key sprites
          *
          * Args
          * --key STRING one of: ${scrapeTargets.join(',')}
          *
          */
      `);
    process.exit(0);
  }

  const invalidKey = !scrapeTargets.includes(argv.key);

  if (!argv.key || invalidKey) {
    console.log(chalk.bgWhite.red(`Image Data key is required.`));
    console.log(chalk.yellow(`Example: npm run scrape:image -- --key sprites`));

    if (invalidKey) {
      console.log(chalk.bgWhite.red(`Invalid key: "${argv.key}"`));
    }

    console.log(chalk.yellow(`Valid keys are below.`));
    scrapeTargets.forEach((k) => console.log(chalk.yellow(k)));
    process.exit(0);
  }

  const $ = await fetchPage(POKEMON, POKEMON_URL);

  const tables = Array.from($('table > tbody')).slice(
    Enums.TABLE_COUNT_OFFSET,
    Enums.GENERATION_COUNT + Enums.TABLE_COUNT_OFFSET
  );

  const items = tables
    .reduce(
      (result, data) => [
        ...result,
        ...Array.from(data.children).map((tr) => {
          const children = $(tr).children();

          if (!children) {
            return null;
          }

          const variantRegion =
            !children
              .first()
              .text()
              .trim() && checkImgForVariant(children.eq(2));

          const isVariant = variantRegion !== false;
          const tdNPN = children.eq(1);
          const td = children.eq(2);
          const img = td
            .children()
            .first()
            .children()
            .first();

          const npn = Mappers.processTdNPN(tdNPN);
          const name = img.attr('alt');
          const src = img.attr('src');

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
    .filter((x) => !!x);

  const { pokedex } = constructPokedex();
  const currentItems = Array.from(pokedex.values()).filter(
    (x) => !x.id.startsWith('m')
  );

  const missing = [];

  items.forEach((item) => {
    const reasons = [];
    const imagePath = path.join(__dirname, './', argv.key, item.filename);

    if (!fs.existsSync(imagePath)) {
      reasons.push('Image does not exist');
    }

    const itemId = item.isVariant
      ? `v_${item.npn}${item.variantRegion > 7`_r${item.variantRegion}`}`
      : item.npn;

    if (!currentItems.find((x) => x.id === itemId)) {
      reasons.push("Current items doesn't contain the entry");
    }

    if (reasons.length) {
      missing.push({ ...item, reasons });
    }
  });

  const filename = path.join(__dirname, `./missing_${argv.key}.json`);
  await writeAsync(filename, JSON.stringify(missing, null, 2));

  /* TODO
   *
   * Ask for user input (Y/N) which will:
   * (N) exit
   * (Y) download missing images into ./images/<name>
   */

  console.log(
    chalk.orange(
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
