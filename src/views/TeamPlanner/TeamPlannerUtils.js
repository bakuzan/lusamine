export function iteratePokedexToList(dex, filters) {
  const exclusions = filters.currentTeamIds;
  return Array.from(dex).reduce((acc, [id, item]) => {
    if (exclusions.has(id) || !item.name.includes(filters.search)) return acc;
    return [...acc, item];
  }, []);
}

export function selectMembersFromPokedex(dex, memberIds) {
  return Array.from(memberIds).map(id => dex.get(id));
}