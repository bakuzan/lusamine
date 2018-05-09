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
    evolutions: mapEvolutionsToPokemon(evolutions)
  };
}
