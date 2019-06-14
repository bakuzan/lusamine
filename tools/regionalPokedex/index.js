const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const cheerio = require('cheerio');
const argv = require('minimist')(process.argv.slice(2));

const handlers = require('./handlers');

// https://bulbapedia.bulbagarden.net/wiki/Regional_Pokédex
const urls = {
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
  alola_u: `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Alola_Pok%C3%A9dex_number_(Ultra_Sun_and_Ultra_Moon)`
};

async function fetchPage(key) {
  const url = urls[key];
  const filename = path.resolve(
    path.join(__dirname, '../cache', `${key}.html`)
  );

  try {
    fs.accessSync(filename, fs.constants.R_OK);
    console.log('Reading from cache');
    const data = fs.readFileSync(filename, 'utf-8');
    return cheerio.load(data);
  } catch (err) {
    console.error('Cache Empty, will request.');
  }

  try {
    const html = await request(url);

    fs.writeFile(filename, html, (err) => {
      const message = err ? 'Failed to cache request' : 'Cached';
      console.log(message);
    });

    return cheerio.load(html);
  } catch (e) {
    console.log(chalk.bgWhite.red('Request failed.'));
    console.error(e);
    process.exit(1);
  }
}

async function run() {
  console.log(chalk.green('Regional Pokedex Scraper!'));
  console.log(argv);
  const invalidKey = !urls.hasOwnProperty(argv.key);

  if (!argv.key || invalidKey) {
    console.log(chalk.bgWhite.red(`Regional Pokedex key is required.`));
    console.log(chalk.yellow(`Example: npm run scrape-pokedex -- --key kanto`));

    if (invalidKey) {
      console.log(chalk.bgWhite.red(`Invalid key: "${argv.key}"`));
    }

    console.log(chalk.yellow(`Valid keys are below.`));
    Object.keys(urls).forEach((k) => console.log(chalk.yellow(k)));
    process.exit(1);
  }

  const $ = await fetchPage(argv.key);
  const handler = handlers[argv.key];
  if (!handler) {
    console.log(chalk.bgWhite.red(`Couldn't find handler for: ${argv.key}`));
    process.exit(1);
  }

  const result = await handler(argv.key, $);
  if (result) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run();
