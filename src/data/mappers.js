import { getKeyByValue } from 'meiko-lib';

import Regions from 'constants/regions';
import { getGeneration } from 'utils/derived-data';

function mapTypesToPokemon(typeIds, types) {
  return typeIds.map((id) => {
    const type = types.find((x) => x.id === id);
    return {
      id: type.id,
      name: type.name
    };
  });
}

function mapEvolutionsToPokemon(evolutions) {
  return evolutions
    .map((e) => ({
      evolvesTo: e.evolvesTo,
      mechanism: e.mechanism
    }))
    .filter((o, i, arr) => {
      const index = arr.findIndex((x) => x.evolvesTo === o.evolvesTo);
      return index === i;
    });
}

export function mapPokemonData({ id, order }, data, types, evolutions) {
  return {
    id,
    order,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: data.name,
    types: mapTypesToPokemon(data.typeIds, types),
    evolutions: mapEvolutionsToPokemon(evolutions),
    generation: getGeneration(data.nationalPokedexNumber)
  };
}

export function mapMegaPokemonData({ id, order }, data, types, basePokemon) {
  const suffix = data.suffix ? ` ${data.suffix}` : '';
  return {
    id,
    order,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: `mega ${basePokemon.name}${suffix}`,
    types: mapTypesToPokemon(data.typeIds, types),
    evolutions: [],
    generation: getGeneration(data.nationalPokedexNumber)
  };
}

export function mapVariantsPokemonData(
  { id, order },
  data,
  types,
  evolutions,
  basePokemon
) {
  const regionName = getKeyByValue(Regions, data.regionId);
  return {
    id,
    order,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: `${regionName} ${basePokemon.name}`,
    types: mapTypesToPokemon(data.typeIds, types),
    evolutions: mapEvolutionsToPokemon(evolutions),
    generation: getGeneration(data.nationalPokedexNumber)
  };
}
