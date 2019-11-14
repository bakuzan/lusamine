import { isMegaPokemon } from 'utils/derivedData';
import groupBy from 'utils/groupBy';

function combineTeamPokemon(pokedex, savedTeams) {
  return Object.keys(savedTeams).flatMap((key) =>
    savedTeams[key].idString.split(',').map((id) => pokedex.get(id))
  );
}

function separateEvolutionForms(pokemon) {
  return [
    {
      label: `Not Fully Evolved`,
      count: pokemon.filter((x) => x.evolutions.length > 0).length
    },
    {
      label: `Fully Evolved`,
      count: pokemon.filter(
        (x) => x.evolutions.length === 0 && !isMegaPokemon(x)
      ).length
    },
    {
      label: `Fully Evolved (Mega)`,
      count: pokemon.filter(isMegaPokemon).length
    }
  ].sort((a, b) => b.count - a.count);
}

export const mapToSortedArray = (m) =>
  Array.from(m)
    .map(([key, items]) => [key, items.length])
    .sort(([_, a], [__, b]) => b - a);

export default function calculateCounts(pokedex, teams) {
  const teamsCount = teams ? Object.keys(teams).length : 0;
  const displayViewerMessage = teamsCount === 0;

  if (displayViewerMessage) {
    return {};
  }

  const allTeamPokemon = combineTeamPokemon(pokedex, teams);
  const totalPokemonCount = allTeamPokemon.length;
  const pokemon = groupBy(allTeamPokemon, (x) => x.nationalPokedexNumber);
  const groupedPokemon = Array.from(pokemon)
    .map(([key, items]) => [key, items.length])
    .sort(([_, a], [__, b]) => b - a);

  const evolutionForms = separateEvolutionForms(allTeamPokemon);
  const types = mapToSortedArray(
    groupBy(allTeamPokemon.flatMap((x) => x.types.map((t) => t.id)))
  );
  const generations = mapToSortedArray(
    groupBy(allTeamPokemon.map((x) => x.generation))
  );

  return {
    totalPokemonCount,
    pokemon,
    groupedPokemon,
    types,
    generations,
    evolutionForms
  };
}
