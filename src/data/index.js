import {
  transformPokemonData,
  transformMegaPokemonData,
  transformVariantPokemonData,
  combineAndSortMaps
} from './transformers';

import pokemon from './raw/pokemon.json';
import megas from './raw/megaEvolutions.json';
import regionalVariants from './raw/regionalVariants.json';
import types from './raw/types.json';
import trainerTeams from './raw/trainerTeams.json';

const SPRITES_PER_ROW = 30;
const ART_PER_ROW = 30;

export function constructPokedex() {
  const pokemonMap = transformPokemonData(pokemon);
  const megasMap = transformMegaPokemonData(megas);
  const variantsMap = transformVariantPokemonData(regionalVariants);

  return combineAndSortMaps(
    ([id, mon], order) => {
      const sOffset = -41;
      const aOffset = -97;
      const sy = -2 + sOffset * Math.floor(order / SPRITES_PER_ROW);
      const sx = -1 + sOffset * (order % SPRITES_PER_ROW);
      const ay = 0 + aOffset * Math.floor((order + 1) / ART_PER_ROW);
      const ax = -1 + aOffset * ((order + 1) % ART_PER_ROW);

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

export function getTrainerTeams() {
  return trainerTeams;
}
