import {
  transformPokemonData,
  transformMegaPokemonData,
  transformVariantPokemonData
} from './transformers';

import pokemon from './raw/pokemon.json';
import megas from './raw/mega-evolutions.json';
import regionalVariants from './raw/regional-variants.json';

export default function constructPokedex() {
  console.groupCollapsed('data');
  console.log('pokemon', pokemon);
  console.log('megas', megas);
  console.log('regionalVariants', regionalVariants);
  console.groupEnd();

  const pokemonMap = transformPokemonData(pokemon);
  const megasMap = transformMegaPokemonData(megas);
  const variantsMap = transformVariantPokemonData(regionalVariants);
  return combineAndSortMaps(pokemonMap, megasMap, variantsMap);
}
