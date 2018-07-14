const path = require('path');
const cheerio = require('cheerio');
const Mappers = require('./mappers');
const Enums = require('./enums');

const buildOuputUrl = fileName => path.join('./tools/output', fileName);

const checkImgForVariant = td => {
  const src = td
    .children()
    .first()
    .children()
    .first()
    .attr('src');
  return src && src.match(/AMS\.png$/);
};

function pokedexProcessor($) {
  const jsonEntries = Array.from($('table > tbody'))
    .slice(
      Enums.TABLE_COUNT_OFFSET,
      Enums.GENERATION_COUNT + Enums.TABLE_COUNT_OFFSET
    )
    .reduce(function(result, data) {
      return Array.from(data.children).reduce((acc, tr) => {
        const $row = cheerio.load(tr);
        const children = $row('td');
        if (!children) return acc;

        const isVariant =
          !children
            .first()
            .text()
            .trim() && checkImgForVariant(children.eq(2));
        const tdNPN = children.eq(1);
        const tdName = children.eq(3);
        const tdTypes = [children.eq(4), children.eq(5)];

        const item = isVariant
          ? Mappers.mapElementsToVariantPokemonJson(
              tdNPN,
              Enums.Regions.alola,
              tdTypes
            )
          : Mappers.mapElementsToPokemonJson(tdNPN, tdName, tdTypes);

        if (!item.nationalPokedexNumber) return acc;
        return [...acc, item];
      }, result);
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
  const evolutions = Array.from($('table.roundy > tbody'))
    .slice(0, 2)
    .reduce(function(result, data) {
      return Array.from(data.children).reduce((acc, tr, i, trs) => {
        const $prevRow = i !== 0 ? cherrio.load(trs[i - 1]) : null;
        const prevChildren = $prevRow('td');

        const $row = cheerio.load(tr);
        const children = $row('td');
        if (!children || children.length === 0) return acc;

        const isSecondRow = children.length < 5;
        const isSingleEvo = children.length < 8;
        const rawEvolutions = [];

        if (!isSecondRow) {
          rawEvolutions.push({
            from: children.eq(1),
            how: children.eq(3),
            to: children.eq(4)
          });

          if (!isSingleEvo) {
            rawEvolutions.push({
              from: children.eq(4),
              how: children.eq(6),
              to: children.eq(7)
            });
          }
        } else {
          const prevIsSingle = prevChildren.length < 8;
          const fromName = prevIsSingle
            ? prevChildren.eq(1)
            : prevChildren.eq(4);

          rawEvolutions.push({
            from: fromName,
            how: children.eq(1),
            to: children.eq(2)
          });
        }

        const items = Mappers.mapElementsToEvolutionJson(rawEvolutions);

        return [...acc, ...items];
      }, result);
    }, []);

  return [
    {
      fileName: buildOuputUrl('evolutions.json'),
      json: evolutions
    }
  ];
}

function megaProcessor($) {
  const megas = Array.from($('table.roundy > tbody'))
    .slice(0, 2)
    .reduce(function(result, data) {
      return Array.from(data.children).reduce((acc, tr) => {
        const $row = cheerio.load(tr);
        const children = $row('td');
        if (!children || children.length === 0) return acc;
        const isSecondMega = children.length === 4;
        const tdData = isSecondMega ? children.first() : children.eq(4);
        const typeIndex = isSecondMega ? 1 : 5;
        const tdTypes = [
          children
            .eq(typeIndex)
            .children()
            .eq(0),
          children
            .eq(typeIndex)
            .children()
            .eq(1)
        ];

        const item = Mappers.mapElementsToMegaJson(tdData, tdTypes);

        if (!item.nationalPokedexNumber) return acc;
        return [...acc, item];
      }, result);
    }, []);

  return [
    {
      fileName: buildOuputUrl('mega-evolutions.json'),
      json: megas
    }
  ];
}

module.exports = {
  pokedexProcessor,
  megaProcessor,
  evolutionProcessor
};
