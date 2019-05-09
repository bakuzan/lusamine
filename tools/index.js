const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const Processors = require('./processors');

function scrapePokemonData(options) {
  const { url, processor } = options;

  request(url, function(error, response, html) {
    if (error) {
      return console.error(`Failed to request ${url}`, error);
    }

    const $ = cheerio.load(html);
    processor($).forEach((output) => {
      const { fileName, json } = output;
      fs.writeFile(fileName, JSON.stringify(json, null, 2), (err) => {
        if (err) {
          return console.error(`Failed to write ${fileName}`, err);
        }

        return console.log(`Successfully written ${fileName}`);
      });
    });
  });
}

[
  // {
  //   url: "https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_National_Pokédex_number",
  //   processor: Processors.pokedexProcessor
  // },
  {
    url:
      'https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_evolution_family',
    processor: Processors.evolutionProcessor
  }
  // {
  //   url: "https://bulbapedia.bulbagarden.net/wiki/Mega_Evolution",
  //   processor: Processors.megaProcessor
  // }
].forEach(scrapePokemonData);
