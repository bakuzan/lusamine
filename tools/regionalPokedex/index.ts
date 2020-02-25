import chalk from 'chalk';
import minimist from 'minimist';

import fetchPage from '../readCachedFile';
import handlers from './handlers';

const argv = minimist(process.argv.slice(2));

// https://bulbapedia.bulbagarden.net/wiki/Regional_Pokédex
const urls: Record<string, string> = {
  kanto: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Kanto_Pok%C3%A9dex_number`, // (?) LG PE
  new: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_New_Pok%C3%A9dex_number`,
  johto: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Johto_Pok%C3%A9dex_number`,
  hoenn: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Hoenn_Pok%C3%A9dex_number_(Generation_III)`,
  hoenn_oras: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Hoenn_Pok%C3%A9dex_number_(Generation_VI)`,
  sinnoh: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Sinnoh_Pok%C3%A9dex_number`, // (?) Enhanced
  unova: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Unova_Pok%C3%A9dex_number`,
  unova_n: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_New_Unova_Pok%C3%A9dex_number`,
  kalos: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Kalos_Pok%C3%A9dex_number`, // 3 parter
  alola: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Alola_Pok%C3%A9dex_number_(Sun_and_Moon)`,
  alola_u: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Alola_Pok%C3%A9dex_number_(Ultra_Sun_and_Ultra_Moon)`,
  galar: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_Galar_Pokédex_number`
};

async function run() {
  console.log(chalk.green('Regional Pokedex Scraper!'));

  if (argv.help) {
    console.log(`
       /* Example usage
        *
        * npm run scrape:region -- --key kanto
        *
        * Args
        * --key STRING one of: ${Object.keys(urls).join(',')}
        *
        */
    `);
    process.exit(0);
  }

  const invalidKey = !urls.hasOwnProperty(argv.key);

  if (!argv.key || invalidKey) {
    console.log(chalk.bgWhite.red(`Regional Pokedex key is required.`));
    console.log(chalk.yellow(`Example: npm run scrape:region -- --key kanto`));

    if (invalidKey) {
      console.log(chalk.bgWhite.red(`Invalid key: "${argv.key}"`));
    }

    console.log(chalk.yellow(`Valid keys are below.`));
    Object.keys(urls).forEach((k) => console.log(chalk.yellow(k)));
    process.exit(0);
  }

  const $ = await fetchPage(argv.key, urls[argv.key]);
  const handler = handlers[argv.key];
  if (!handler) {
    console.log(chalk.bgWhite.red(`Couldn't find handler for: ${argv.key}`));
    process.exit(0);
  }

  const result = await handler(argv.key, $);
  if (result) {
    process.exit(0);
  } else {
    console.log('Process Failed.');
    process.exit(0);
  }
}

run();
