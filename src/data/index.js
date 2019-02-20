import {
  transformPokemonData,
  transformMegaPokemonData,
  transformVariantPokemonData,
  combineAndSortMaps
} from './transformers';

import pokemon from './raw/pokemon.json';
import megas from './raw/mega-evolutions.json';
import regionalVariants from './raw/regional-variants.json';
import types from './raw/types.json';

const SPRITES_PER_ROW = 31;
const ART_PER_ROW = 30;

export function constructPokedex() {
  const pokemonMap = transformPokemonData(pokemon);
  const megasMap = transformMegaPokemonData(megas);
  const variantsMap = transformVariantPokemonData(regionalVariants);

  return combineAndSortMaps(
    ([id, mon], order) => {
      const sOffset = -42;
      const aOffset = -98;
      const sy = -4 + sOffset * Math.floor(order / SPRITES_PER_ROW);
      const sx = -2 + sOffset * (order % SPRITES_PER_ROW);
      const ay = 0 + aOffset * Math.floor(order / ART_PER_ROW);
      const ax = -2 + aOffset * (order % ART_PER_ROW);
      // TODO check these values
      return [
        id,
        {
          ...mon,
          spritePosition: { backgroundPosition: `${sx}px ${sy}px` },
          artPosition: { backgroundPosition: `${ax}px ${ay}px` }
        }
      ];
    },
    pokemonMap,
    megasMap,
    variantsMap
  );
}

export function getTypeMatchups() {
  return types.reduce((p, c) => {
    p.set(c.id, c);
    return p;
  }, new Map());
}
