import * as Mappers from './mappers';
import * as IdGenerators from './idGenerators';
import sortCombinedData from 'utils/sorters';

import pokemon from './raw/pokemon.json';
import types from './raw/types.json';
import evolutions from './raw/evolutions.json';
import starters from './raw/starters.json';

export function transformPokemonData(data) {
  return data.reduce((p, c) => {
    const id = IdGenerators.generatePokemonId(p, c);
    const isStarter = starters.includes(c.nationalPokedexNumber);
    const pokemonTypes = types.filter((x) => c.typeIds.includes(x.id));
    const pokemonEvolutions = evolutions.filter(
      (x) => x.nationalPokedexNumber === c.nationalPokedexNumber
    );

    return p.set(
      id,
      Mappers.mapPokemonData(id, c, pokemonTypes, pokemonEvolutions, isStarter)
    );
  }, new Map());
}

export function transformMegaPokemonData(data) {
  return data.reduce((p, c) => {
    const id = IdGenerators.generateMegaPokemonId(p, c);
    const basePokemon = pokemon.find(
      (x) => x.nationalPokedexNumber === c.nationalPokedexNumber
    );
    const pokemonTypes = types.filter((x) => c.typeIds.includes(x.id));

    return p.set(
      id,
      Mappers.mapMegaPokemonData(id, c, pokemonTypes, basePokemon)
    );
  }, new Map());
}

export function transformVariantPokemonData(data) {
  return data.reduce((p, c) => {
    const id = IdGenerators.generateVariantPokemonId(p, c);
    const basePokemon = pokemon.find(
      (x) =>
        x.nationalPokedexNumber === c.nationalPokedexNumber &&
        (!c.form || x.form === c.form)
    );
    const pokemonTypes = types.filter((x) => c.typeIds.includes(x.id));
    const pokemonEvolutions = evolutions.filter(
      (x) => x.nationalPokedexNumber === c.nationalPokedexNumber
    );

    return p.set(
      id,
      Mappers.mapVariantsPokemonData(
        id,
        c,
        pokemonTypes,
        pokemonEvolutions,
        basePokemon
      )
    );
  }, new Map());
}

function reduceMapsToArray(combined, aMap) {
  return [...combined, ...Array.from(aMap)];
}

export function combineAndSortMaps(mapper, ...maps) {
  const combinedData = maps
    .reduce(reduceMapsToArray, [])
    .sort(sortCombinedData)
    .map(mapper);

  return new Map([...combinedData]);
}
