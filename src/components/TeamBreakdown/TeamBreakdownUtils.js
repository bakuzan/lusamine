import Strings from 'constants/strings';

const generateCountMap = property => (typesEmpty, typesData, memberTypeIds) => {
  const countMap = new Map(typesEmpty.slice());
  return memberTypeIds.reduce((counts, id) => {
    const values = typesData.get(id)[property];
    return values.reduce((p, v) => {
      const currentValue = counts.get(v);
      p.set(v, currentValue + 1);
      return p;
    }, counts);
  }, countMap);
};
const getWeakToCount = generateCountMap(Strings.typeBreakdown.weakTo);
const getResistsCount = generateCountMap(Strings.typeBreakdown.resists);
const getUnaffectedByCount = generateCountMap(
  Strings.typeBreakdown.unaffectedBy
);

export function buildTeamWeaknessCounts(types, members) {
  const memberTypeIds = [...members.values()].reduce(
    (p, c) => [...p, ...c.types.map(x => x.id)],
    []
  );
  const typesMapEmpty = [...types.values()].map(t => [t.id, 0]);
  const weakCounts = getWeakToCount(typesMapEmpty, types, memberTypeIds);
  const resistCounts = getResistsCount(typesMapEmpty, types, memberTypeIds);
  const unaffectedCounts = getUnaffectedByCount(
    typesMapEmpty,
    types,
    memberTypeIds
  );
  return [
    { key: Strings.typeBreakdown.weakTo, counts: weakCounts },
    { key: Strings.typeBreakdown.resists, counts: resistCounts },
    { key: Strings.typeBreakdown.unaffectedBy, counts: unaffectedCounts }
  ];
}
