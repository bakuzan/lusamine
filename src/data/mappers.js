import { Utils } from 'meiko';

import Regions from 'constants/regions';
import { getGeneration } from 'utils/derived-data';

const { capitalise, getKeyByValue } = Utils.Common;

function mapTypesToPokemon(types) {
  return types.map(t => ({
    id: t.id,
    name: t.name
  }));
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
    types: mapTypesToPokemon(types),
    evolutions: mapEvolutionsToPokemon(evolutions),
    generation: getGeneration(data.nationalPokedexNumber)
  };
}

export function mapMegaPokemonData(id, data, types, basePokemon) {
  const suffix = data.suffix ? ` ${data.suffix}` : '';
  return {
    id,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: `Mega ${basePokemon.name}${suffix}`,
    types: mapTypesToPokemon(types),
    evolutions: [],
    generation: getGeneration(data.nationalPokedexNumber)
  };
}

const getRegionName = compose(capitalise, getKeyByValue);

export function mapVariantsPokemonData(
  id,
  data,
  types,
  evolutions,
  basePokemon
) {
  const regionName = getRegionName(Regions, data.regionId);
  return {
    id,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: `${regionName} ${basePokemon.name}`,
    types: mapTypesToPokemon(types),
    evolutions: mapEvolutionsToPokemon(evolutions),
    generation: getGeneration(data.nationalPokedexNumber)
  };
}
