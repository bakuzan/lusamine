import { Utils } from 'meiko';

import Regions from 'constants/regions';
import { getGeneration } from 'utils/derived-data';

const { getKeyByValue } = Utils.Common;

function mapTypesToPokemon(typeIds, types) {
  return typeIds.map(id => {
    const type = types.find(x => x.id === id);
    return {
      id: type.id,
      name: type.name
    };
  });
}

function mapEvolutionsToPokemon(evolutions) {
  return evolutions.map(e => ({
    evolvesTo: e.evolvesTo,
    mechanism: e.mechanism
  }));
}

export function mapPokemonData(id, data, types, evolutions) {
  return {
    id,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: data.name,
    types: mapTypesToPokemon(data.typeIds, types),
    evolutions: mapEvolutionsToPokemon(evolutions),
    generation: getGeneration(data.nationalPokedexNumber)
  };
}

export function mapMegaPokemonData(id, data, types, basePokemon) {
  const suffix = data.suffix ? ` ${data.suffix}` : '';
  return {
    id,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: `mega ${basePokemon.name}${suffix}`,
    types: mapTypesToPokemon(data.typeIds, types),
    evolutions: [],
    generation: getGeneration(data.nationalPokedexNumber)
  };
}

export function mapVariantsPokemonData(
  id,
  data,
  types,
  evolutions,
  basePokemon
) {
  const regionName = getKeyByValue(Regions, data.regionId);
  return {
    id,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: `${regionName} ${basePokemon.name}`,
    types: mapTypesToPokemon(data.typeIds, types),
    evolutions: mapEvolutionsToPokemon(evolutions),
    generation: getGeneration(data.nationalPokedexNumber)
  };
}
