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

export function constructPokedex() {
  const pokemonMap = transformPokemonData(pokemon);
  const megasMap = transformMegaPokemonData(megas);
  const variantsMap = transformVariantPokemonData(regionalVariants);
  return combineAndSortMaps(pokemonMap, megasMap, variantsMap);
}

export function getTypeMatchups() {
  return types.reduce((p, c) => {
    p.set(c.id, c);
    return p;
  }, new Map());
}
