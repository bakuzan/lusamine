import * as Mappers from './mappers';

import types from './raw/types.json';
import pokemon from './raw/pokemon.json';
import evolutions from './raw/evolutions.json';
import regionalVariants from './raw/regional-variants.json';

function generatePokemonId(data) {
  return `p_${data.nationalPokedexNumber}`;
}

export default function constructPokedex() {
  console.groupCollapsed('data');
  console.log('types', types);
  console.log('pokemon', pokemon);
  console.log('evolutions', evolutions);
  console.log('regionalVariants', regionalVariants);
  console.groupEnd();
  const pokemonMap = new Map();
  return pokemon.reduce((p, c) => {
    const id = generatePokemonId(c);
    const pokemonTypes = types.filter(x => c.typeIds.includes(x.id));
    const pokemonEvolutions = evolutions.filter(
      x => x.nationalPokedexNumber === c.nationalPokedexNumber
    );
    p.set(id, Mappers.mapPokemonData(id, c, pokemonTypes, pokemonEvolutions));
    return p;
  }, pokemonMap);
}
