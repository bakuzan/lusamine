import path from 'path';
import cheerio from 'cheerio';
import Mappers from './mappers';
import * as Enums from './enums';

const buildOuputUrl = fileName => 
  path.join("./tools/output", fileName);

function pokedexProcessor($) {
  const jsonEntries = Array.from($('table > tbody'))
  .slice(Enums.TABLE_COUNT_OFFSET, Enums.GENERATION_COUNT + Enums.TABLE_COUNT_OFFSET)
  .reduce(function (result, data) {
      return Array.from(data.children)
      .reduce((acc, tr) => {
        const $row = cheerio.load(tr);
        const children = $row('td');
        if (!children) return acc;

        const isVariant = !children.first().text().trim();
        const tdNPN = children.eq(1);
        const tdName = children.eq(3);
        const tdTypes = [
          children.eq(4),
          children.eq(5)
        ];
        
        const item = isVariant
          ? Mappers.mapElementsToVariantPokemonJson(tdNPN, Enums.Regions.alola, tdTypes)
          : Mappers.mapElementsToPokemonJson(tdNPN, tdName, tdTypes);
        
        if (!item.nationalPokedexNumber) return acc;
        return [...acc, item];
      }, result)
  }, []);
  const pokemon = jsonEntries.filter(x => x.name);
  const variants = jsonEntries.filter(x => !x.name);
  return [
    {
        fileName: buildOuputUrl('pokemon.json'),
        json: pokemon
    },
    {
        fileName: buildOuputUrl('regional-variants.json'),
        json: variants
    }
  ]; 
}

function evolutionProcessor($) {
    $('table > tbody').filter(function () {
        const data = $(this);

        return [
          {
              fileName: buildOuputUrl('evolutions.json'),
              json: []
          }
        ];
    });
}

function megaProcessor($) {
    const megas = Array.from($('table.roundy > tbody'))
    .slice(0,2)
    .reduce(function (result, data) {
        return Array.from(data.children)
        .reduce((acc, tr) => {
          const $row = cheerio.load(tr);
          const children = $row('td');
          if (!children) return acc;
          const isSecondMega = children.length === 4;
          const tdData = isSecondMega 
            ? children.first()
            : children.eq(4);
          const typeIndex = isSecondMega
           ? 1
           : 5;
          const tdTypes = children.eq(typeIndex)
          .children()
          .map(x => x.children().first());
          
          const item = Mappers.mapElementsToMegaJson(tdData, tdTypes);
    
          if (!item.nationalPokedexNumber) return acc;
          return [...acc, item];
        }, result)
    }, []);

    return [
      {
          fileName: buildOuputUrl('mega-evolutions.json'),
          json: megas
      }
    ];
}


export default {
    pokedexProcessor,
    megaProcessor,
    evolutionProcessor
};