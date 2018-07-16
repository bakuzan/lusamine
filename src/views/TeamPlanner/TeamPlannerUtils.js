import Types from 'constants/types';
import Generations from 'constants/generations';
import { EvolutionForms } from 'constants/evolutions';
import { capitalise, separateAndCapitaliseAll } from 'utils/common';
import { isMegaPokemon, isVariantPokemon } from 'utils/derived-data';

function isExcludedEvolutionType(pEvolutions, evolutionFilters) {
  const length = evolutionFilters.length;
  if (length === 2) return false;
  if (length === 0) return true;

  const filter = evolutionFilters[0];
  return (
    (filter === EvolutionForms.notEvolved && !pEvolutions.length) ||
    (filter === EvolutionForms.fullyEvolved && pEvolutions.length)
  );
}

function applyDexFilters(item, filters, typeMatches) {
  const {
    currentTeamIds,
    generations,
    types,
    resists,
    evolutions,
    search,
    includeMega,
    includeVariants
  } = filters;
  if (!includeMega && isMegaPokemon(item)) return true;
  if (!includeVariants && isVariantPokemon(item)) return true;

  return (
    currentTeamIds.has(item.id) ||
    !item.name.includes(search) ||
    !generations.includes(item.generation) ||
    !item.types.some(x => types.includes(x.id)) ||
    !item.types.some(x => {
      const { resists: resistsForType, unaffectedBy } = typeMatches.get(x.id);
      return (
        resists.some(r => resistsForType.includes(r)) ||
        resists.some(r => unaffectedBy.includes(r))
      );
    }) ||
    isExcludedEvolutionType(item.evolutions, evolutions)
  );
}

export function iteratePokedexToList(dex, filters, typeMatches) {
  return Array.from(dex).reduce((acc, [id, item]) => {
    if (applyDexFilters(item, filters, typeMatches)) return acc;
    return [...acc, item];
  }, []);
}

const getAllEnumValues = obj => Object.keys(obj).map(k => obj[k]);

const getEnumOptions = (obj, fn) =>
  Object.keys(obj).map(k => ({
    value: obj[k],
    text: fn(k)
  }));

export const generationOptions = getEnumOptions(
  Generations,
  k => `${capitalise(k.slice(0, 3))} ${k.slice(-1)}`
);
export const generationDefaults = getAllEnumValues(Generations);

export const typeOptions = getEnumOptions(Types, k => capitalise(k));
export const typeDefaults = getAllEnumValues(Types);

export const evolutionOptions = getEnumOptions(EvolutionForms, k =>
  separateAndCapitaliseAll(k)
);
export const evolutionDefaults = getAllEnumValues(EvolutionForms);

export const selectRandomSetOfIds = dex => {
  const pokemonIds = [...dex.keys()];
  const randomTeam = new Set([]);
  return Array(6)
    .fill(null)
    .reduce(team => {
      const randomIndex = Math.floor(Math.random() * pokemonIds.length);
      const selectedId = pokemonIds[randomIndex];
      team.add(selectedId);
      return team;
    }, randomTeam);
};
