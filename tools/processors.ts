import path from 'path';
import Mappers from './mappers';
import Enums from './enums';
import { PokemonInstance, isPokemon, isVariant } from './types/Pokemon';
import { Evolution } from './types/Evolution';
import { MegaPokemon } from './types/Mega';
import { checkImgForVariant } from './utils';

const buildOuputUrl = (fileName: string) =>
  path.join('./tools/output', fileName);

function pokedexProcessor($: cheerio.Root) {
  const jsonEntries = Array.from($('table > tbody'))
    .slice(
      Enums.TABLE_COUNT_OFFSET,
      Enums.GENERATION_COUNT + Enums.TABLE_COUNT_OFFSET
    )
    .reduce((result, data) => {
      return Array.from($(data).children()).reduce((acc, tr) => {
        const children = $(tr).children();

        if (!children) {
          return acc;
        }

        const variantRegion =
          !children.first().text().trim() &&
          checkImgForVariant(children.first());

        const isVariantItem = variantRegion !== false;
        const tdNPN = children.eq(0);
        const tdName = children.eq(2);

        let item;
        if (isVariantItem) {
          const tdTypes = [children.eq(2), children.eq(3)];
          item = Mappers.mapElementsToVariantPokemonJson(
            tdNPN,
            variantRegion,
            tdTypes
          );
        } else {
          const tdTypes = [children.eq(3), children.eq(4)];
          item = Mappers.mapElementsToPokemonJson(tdNPN, tdName, tdTypes);
        }

        if (!item.nationalPokedexNumber) {
          return acc;
        }

        return [...acc, item];
      }, result);
    }, [] as PokemonInstance[]);

  const pokemon = jsonEntries.filter(isPokemon);
  const variants = jsonEntries.filter(isVariant);

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

function evolutionProcessor($: cheerio.Root) {
  const evolutions = Array.from($('table.roundy > tbody'))
    .slice(0, Enums.GENERATION_COUNT + 2) // Paldea/Kitakami, Other
    .reduce((result, data) => {
      return Array.from($(data).children()).reduce((acc, tr, i, trs) => {
        const prevChildren = i !== 0 ? $(trs[i - 1]).children() : null;
        const children = $(tr).children();

        if (!children || children.length < 3) {
          return acc;
        }

        const ignore =
          (children.length === 3 && children.eq(2).attr('colspan') === '6') ||
          (children.length === 4 && children.eq(3).attr('colspan') === '5');

        if (ignore) {
          return acc;
        }

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
          if (!prevChildren) {
            console.log(
              'No previous?!',
              children.eq(0).text(),
              children.eq(1).text()
            );
            return acc;
          }

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

        const [prev] = acc.slice(-1);
        const items = Mappers.mapElementsToEvolutionJson(prev, rawEvolutions);

        return [...acc, ...items];
      }, result);
    }, [] as Evolution[]);

  return [
    {
      fileName: buildOuputUrl('evolutions.json'),
      json: evolutions
    }
  ];
}

// 2024-01-15: No longer works, however, it seems like there will be no new mega pokemon.
function megaProcessor($: cheerio.Root) {
  const megas = Array.from($('table.roundy > tbody'))
    .slice(0, 2)
    .reduce((result, data) => {
      return Array.from($(data).children()).reduce((acc, tr) => {
        const children = $(tr).children();

        if (!children || children.length === 0) {
          return acc;
        }

        const isSecondMega = children.length === 4;
        const tdData = isSecondMega ? children.first() : children.eq(4);
        const typeIndex = isSecondMega ? 1 : 5;
        const tdTypes = [
          children.eq(typeIndex).children().eq(0),
          children.eq(typeIndex).children().eq(1)
        ];

        const item = Mappers.mapElementsToMegaJson(tdData, tdTypes);

        if (!item.nationalPokedexNumber) {
          return acc;
        }

        return [...acc, item];
      }, result);
    }, [] as MegaPokemon[]);

  return [
    {
      fileName: buildOuputUrl('mega-evolutions.json'),
      json: megas
    }
  ];
}

export default {
  checkImgForVariant,
  pokedexProcessor,
  megaProcessor,
  evolutionProcessor
};
