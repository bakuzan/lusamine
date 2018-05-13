import * as Mappers from './mappers';
import * as IdGenerators from './id-generators';
import sortCombinedData from 'utils/sorters';

import pokemon from './raw/pokemon.json';
import types from './raw/types.json';
import evolutions from './raw/evolutions.json';

export function transformPokemonData(data) {
  return data.reduce((p, c) => {
    const id = IdGenerators.generatePokemonId(c);
    const pokemonTypes = types.filter(x => c.typeIds.includes(x.id));
    const pokemonEvolutions = evolutions.filter(
      x => x.nationalPokedexNumber === c.nationalPokedexNumber
    );
    p.set(id, Mappers.mapPokemonData(id, c, pokemonTypes, pokemonEvolutions));
    return p;
  }, new Map());
}

export function transformMegaPokemonData(data) {
  return data.reduce((p, c) => {
    const id = IdGenerators.generateMegaPokemonId(c);
    const basePokemon = pokemon.find(
      x => x.nationalPokedexNumber === c.nationalPokedexNumber
    );
    const pokemonTypes = types.filter(x => c.typeIds.includes(x.id));
    p.set(id, Mappers.mapMegaPokemonData(id, c, pokemonTypes, basePokemon));
    return p;
  }, new Map());
}

export function transformVariantPokemonData(data) {
  return data.reduce((p, c) => {
    const id = IdGenerators.generateVariantPokemonId(c);
    const basePokemon = pokemon.find(
      x => x.nationalPokedexNumber === c.nationalPokedexNumber
    );
    const pokemonTypes = types.filter(x => c.typeIds.includes(x.id));
    const pokemonEvolutions = evolutions.filter(
      x => x.nationalPokedexNumber === c.nationalPokedexNumber
    );
    p.set(
      id,
      Mappers.mapVariantsPokemonData(
        id,
        c,
        pokemonTypes,
        pokemonEvolutions,
        basePokemon
      )
    );
    return p;
  }, new Map());
}

function reduceMapsToArray(combined, aMap) {
  return [...combined, ...Array.from(aMap)];
}

export function combineAndSortMaps(...maps) {
  const combinedData = maps
    .reduce(reduceMapsToArray, [])
    .sort(sortCombinedData);
  return new Map([...combinedData]);
}
