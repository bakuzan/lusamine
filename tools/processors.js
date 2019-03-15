const path = require('path');
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
        const children = $('td', tr);

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
    .slice(0, Enums.GENERATION_COUNT)
    .reduce(function(result, data) {
      return Array.from(data.children).reduce((acc, tr, i, trs) => {
        const prevChildren = i !== 0 ? $('td', trs[i - 1]) : null;

        const children = $('td', tr);

        if (!children || children.length === 0) return acc;

        const ignore =
          (children.length === 3 && children.eq(2).attr('colspan') === '6') ||
          (children.length === 4 && children.eq(3).attr('colspan') === '5');
        if (ignore) return acc;

        const isSecondRow = children.length < 5;
        const isSingleEvo = children.length < 8;
        const rawEvolutions = [];

        if (!isSecondRow) {
          rawEvolutions.push({
            from: children.eq(0),
            how: children.eq(2),
            to: children.eq(3)
          });

          if (!isSingleEvo) {
            rawEvolutions.push({
              from: children.eq(3),
              how: children.eq(5),
              to: children.eq(6)
            });
          }
        } else {
          const prevIsSingle = prevChildren.length < 8;
          const fromName = prevIsSingle
            ? prevChildren.eq(0)
            : prevChildren.eq(3);

          rawEvolutions.push({
            from: fromName,
            how: children.eq(0),
            to: children.eq(1)
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
        const children = $('td', tr);

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