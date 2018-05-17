import Generations from 'constants/generations';

export function iteratePokedexToList(dex, filters) {
  const exclusions = filters.currentTeamIds;
  return Array.from(dex).reduce((acc, [id, item]) => {
    if (exclusions.has(id) || !item.name.includes(filters.search)) return acc;
    return [...acc, item];
  }, []);
}

export function selectMembersFromPokedex(dex, memberIds) {
  return new Map(Array.from(memberIds).map(id => [id, dex.get(id)]));
}

export const generationOptions = Object.keys(Generations).map(k => ({
  value: Generations[k],
  text: k // TODO needs processing! from gen1, to Gen 1
}));
export const generationDefaults = Object.keys(Generations).map(
  k => Generations[k]
);
