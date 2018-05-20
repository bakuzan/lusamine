export function buildTeamWeaknessCounts(types, members) {
  const memberTypeIds = [...members.values()].reduce(
    (p, c) => [...p, ...c.types.map(x => x.id)],
    []
  );
  console.log('TBU', memberTypeIds, [...types.values()]);
  return [];
}
