const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const argv = require('minimist')(process.argv.slice(2));

const fetchPage = require('../readCachedFile');
const Enums = require('../enums');

const writeAsync = promisify(fs.writeFile);

const POKEMON = 'pokemon';
const POKEMON_URL =
  'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_National_Pokédex_number';

const scrapeTargets = ['sprite', 'art'];

async function run() {
  console.log(chalk.green('Image Scraper!'));

  if (argv.help) {
    console.log(`
         /* Example usage
          *
          * npm run scrape:image -- --key sprite
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
    console.log(chalk.yellow(`Example: npm run scrape:image -- --key sprite`));

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

          const td = children.eq(2);
          const img = td
            .children()
            .first()
            .children()
            .first();

          const name = img.attr('alt');
          const src = img.attr('src');
          const height = img.attr('height');
          const width = img.attr('width');

          if (!src) {
            return null;
          }

          return { name, src: `https:${src}`, height, width };
        })
      ],
      []
    )
    .filter((x) => !!x);

  /*
   * TODO
   *  download and write the image files to the sprites folder...
   *  art cannot be "guessed" from the sprite..will need a separate process.
   *
   */

  if (argv.key === 'sprite') {
    // const filename = path.join(__dirname, './sprites.json');
    // await writeAsync(filename, JSON.stringify(items, null, 2));
    console.log(
      chalk.blue(`Items > ${items.length} (48 mega evolutions not included)`)
    );
    console.log(chalk.blue('Finished successfully!'));
  } else if (argv.key === 'art') {
    console.log(chalk.orange('Art handling not implemented.'));
  }

  process.exit(0);
}

run();
