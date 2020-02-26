import { capitalise, separateAndCapitaliseAll } from 'ayaka/capitalise';
import Types from 'constants/types';
import Generations from 'constants/generations';
import { EvolutionForms } from 'constants/evolutions';
import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';

const padInt = (n) => `${n}`.padStart(3, '0');

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
    includeVariants,
    startersOnly
  } = filters;
  if (!includeMega && isMegaPokemon(item)) {
    return true;
  }
  if (!includeVariants && isVariantPokemon(item)) {
    return true;
  }
  if (startersOnly && !item.isStarter) {
    return true;
  }

  const npn = padInt(item.nationalPokedexNumber);

  return (
    currentTeamIds.has(item.id) ||
    ![npn, item.name, item.form].some((x) => x.includes(search)) ||
    !generations.includes(item.generation) ||
    !item.types.some((x) => types.includes(x.id)) ||
    !item.types.some((x) => {
      const { resists: resistsForType, unaffectedBy } = typeMatches.get(x.id);
      return (
        resists.some((r) => resistsForType.includes(r)) ||
        resists.some((r) => unaffectedBy.includes(r))
      );
    }) ||
    isExcludedEvolutionType(item.evolutions, evolutions)
  );
}

export function iteratePokedexToList(
  { pokedex, regions },
  filters,
  typeMatches
) {
  const dexKey = regions[filters.activePokedex];
  const dex = !dexKey
    ? Array.from(pokedex)
    : dexKey.reduce((p, x) => {
        const region = x.region > 7 ? `_r${x.region}` : '';
        const m = x.isVariant
          ? pokedex.get(`v_${x.nationalPokedexNumber}${region}${x.formSuffix}`)
          : pokedex.get(`p_${x.nationalPokedexNumber}${x.formSuffix}`);

        if (!m) {
          return p;
        }

        return [...p, [m.id, m]];
      }, []);

  return dex.reduce((acc, [_, item]) => {
    if (applyDexFilters(item, filters, typeMatches)) {
      return acc;
    }

    return [...acc, item];
  }, []);
}

const getAllEnumValues = (obj) => Object.keys(obj).map((k) => obj[k]);

const getEnumOptions = (obj, fn) =>
  Object.keys(obj).map((k) => ({
    value: obj[k],
    text: fn(k)
  }));

export const generationOptions = getEnumOptions(
  Generations,
  (k) => `${capitalise(k.slice(0, 3))} ${k.slice(-1)}`
);

export const generationDefaults = getAllEnumValues(Generations);

export const typeOptions = getEnumOptions(Types, (k) => capitalise(k));
export const typeDefaults = getAllEnumValues(Types);

export const evolutionOptions = getEnumOptions(EvolutionForms, (k) =>
  separateAndCapitaliseAll(k)
);

export const evolutionDefaults = getAllEnumValues(EvolutionForms);

export const selectRandomSetOfIds = (dexData, filters, typeMatches) => {
  const randomTeam = new Set([]);
  const pokemon = iteratePokedexToList(dexData, filters, typeMatches);

  return Array(6)
    .fill(null)
    .reduce((team) => {
      const randomIndex = Math.floor(Math.random() * pokemon.length);
      const selected = pokemon[randomIndex];

      return team.add(selected.id);
    }, randomTeam);
};
