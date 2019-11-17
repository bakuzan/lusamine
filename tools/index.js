const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const cheerio = require('cheerio');
const { promisify } = require('util');
const argv = require('minimist')(process.argv.slice(2));

const Processors = require('./processors');

const writeAsync = promisify(fs.writeFile);

const keys = (m) => Array.from(m.keys());

const POKEMON = 'pokemon';
const EVOLVE = 'evolve';
const MEGA = 'mega';

async function scrapePokemonData(htmlPage, processor) {
  const data = await processor(htmlPage);

  for (let output of data) {
    const { fileName, json } = output;
    try {
      await writeAsync(fileName, JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(`Failed to write results to: ${fileName}`);
      console.error(e);
    }
  }

  return true;
}

const scrapeTargets = new Map([
  [
    POKEMON,
    {
      url:
        'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_National_Pokédex_number',
      processor: Processors.pokedexProcessor
    }
  ],
  [
    EVOLVE,
    {
      url:
        'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_evolution_family',
      processor: Processors.evolutionProcessor
    }
  ],
  [
    MEGA,
    {
      url: 'https://bulbapedia.bulbagarden.net/wiki/Mega_Evolution',
      processor: Processors.megaProcessor
    }
  ]
]);

async function fetchPage(key) {
  const { url } = scrapeTargets.get(key);
  const filename = path.resolve(path.join(__dirname, './cache', `${key}.html`));
  console.log(key, __dirname, filename);
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
    await writeAsync(filename, html);

    return cheerio.load(html);
  } catch (e) {
    console.log(chalk.bgWhite.red('Request failed.'));
    console.error(e);
    process.exit(1);
  }
}

async function run() {
  console.log(chalk.green('Pokedex Scraper!'));

  if (argv.help) {
    console.log(`
       /* Example usage
        *
        * npm run scrape:data -- --key pokemon
        *
        * Args
        * --key STRING one of: ${keys(scrapeTargets).join(',')}
        *
        */
    `);
    process.exit(0);
  }

  const invalidKey = !scrapeTargets.has(argv.key);

  if (!argv.key || invalidKey) {
    console.log(chalk.bgWhite.red(`Pokedex Data key is required.`));
    console.log(chalk.yellow(`Example: npm run scrape:data -- --key pokemon`));

    if (invalidKey) {
      console.log(chalk.bgWhite.red(`Invalid key: "${argv.key}"`));
    }

    console.log(chalk.yellow(`Valid keys are below.`));
    keys(scrapeTargets).forEach((k) => console.log(chalk.yellow(k)));
    process.exit(1);
  }

  const info = scrapeTargets.get(argv.key);
  const $ = await fetchPage(argv.key);
  const result = await scrapePokemonData($, info.processor);

  if (result) {
    console.log(chalk.blue('Finished successfully!'));
    process.exit(0);
  } else {
    console.log(chalk.orange('Finished unsuccessfully'));
    process.exit(1);
  }
}

run();
