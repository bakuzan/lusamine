import { Utils } from 'meiko';

import Types from 'constants/types';
import Generations from 'constants/generations';
import { isMegaPokemon, isVariantPokemon } from 'utils/derived-data';

const { capitalise } = Utils.Common;

function applyDexFilters(item, filters, typeMatches) {
  const {
    currentTeamIds,
    generations,
    types,
    resists,
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
      const { resists: resistsForType } = typeMatches.get(x.id);
      return resists.some(r => resistsForType.includes(r));
    })
  );
}

export function iteratePokedexToList(dex, filters, typeMatches) {
  return Array.from(dex).reduce((acc, [id, item]) => {
    if (applyDexFilters(item, filters, typeMatches)) return acc;
    return [...acc, item];
  }, []);
}

export function selectMembersFromPokedex(dex, memberIds) {
  return new Map(Array.from(memberIds).map(id => [id, dex.get(id)]));
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
