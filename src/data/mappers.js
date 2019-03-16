import { getKeyByValue } from 'utils/common';

import Regions from 'constants/regions';
import { getGeneration } from 'utils/derivedData';

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

export function mapPokemonData(id, data, types, evolutions) {
  return {
    id,
    nationalPokedexNumber: data.nationalPokedexNumber,
    name: data.name,
    form: data.form,
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
    form: '',
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
    form: '',
    types: mapTypesToPokemon(data.typeIds, types),
    evolutions: mapEvolutionsToPokemon(evolutions),
    generation: getGeneration(data.nationalPokedexNumber)
  };
}
