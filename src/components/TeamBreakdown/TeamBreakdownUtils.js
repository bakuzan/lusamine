import Strings from 'constants/strings';
import Generations from 'constants/generations';
import { EvolutionForms } from 'constants/evolutions';
import {
  iterateMapToArray,
  separateAndCapitaliseAll,
  getKeyByValue
} from 'utils/common';

const generateCountMap = (property) => (
  typesEmpty,
  typesData,
  memberTypeIds
) => {
  const countMap = new Map(typesEmpty.slice());
  return memberTypeIds.reduce((counts, typeIds) => {
    const values = typeIds.reduce(
      (p, tId) => [...p, ...typesData.get(tId)[property]],
      []
    );
    const uniqueValues = [...new Set([...values]).values()];
    return uniqueValues.reduce((p, v) => p.set(v, counts.get(v) + 1), counts);
  }, countMap);
};

const getWeakToCount = generateCountMap(Strings.typeBreakdown.weakTo);
const getResistsCount = generateCountMap(Strings.typeBreakdown.resists);
const getUnaffectedByCount = generateCountMap(
  Strings.typeBreakdown.unaffectedBy
);

export function buildTeamWeaknessCounts(types, members) {
  const memberTypeIds = [...members.values()].reduce(
    (p, c) => [...p, c.types.map((x) => x.id)],
    []
  );
  const typesMapEmpty = [...types.values()].map((t) => [t.id, 0]);
  const weakCounts = getWeakToCount(typesMapEmpty, types, memberTypeIds);
  const resistCounts = getResistsCount(typesMapEmpty, types, memberTypeIds);
  const unaffectedCounts = getUnaffectedByCount(
    typesMapEmpty,
    types,
    memberTypeIds
  );
  return [
    {
      key: Strings.typeBreakdown.weakTo,
      counts: weakCounts,
      goodCountModifier: Strings.scoreModifier.none
    },
    {
      key: Strings.typeBreakdown.resists,
      counts: resistCounts,
      goodCountModifier: Strings.scoreModifier.high
    },
    {
      key: Strings.typeBreakdown.unaffectedBy,
      counts: unaffectedCounts,
      goodCountModifier: Strings.scoreModifier.high
    }
  ];
}

// NEW WEAKNESS COUNTS
export function NEW_buildTeamWeaknessCounts(types, members) {
  const memberTypeIds = [...members.values()].reduce(
    (p, c) => [...p, { id: c.id, typeIds: c.types.map((x) => x.id) }],
    []
  );
  const typesMapEmpty = [...types.values()].map((t) => [t.id, []]);

  const unaffectedCounts = memberTypeIds.reduce((counts, mem) => {
    const values = mem.typeIds.reduce(
      (p, tId) => [...p, ...types.get(tId)[Strings.typeBreakdown.unaffectedBy]],
      []
    );
    const uniqueValues = [...new Set([...values]).values()];
    return uniqueValues.reduce(
      (p, v) => p.set(v, [...p.get(v), mem.id]),
      counts
    );
  }, new Map(typesMapEmpty.slice()));

  const { weakCounts, resistCounts } = memberTypeIds.reduce(
    (maps, mem) => {
      const weakIds = mem.typeIds.reduce(
        (p, tId) => [...p, ...types.get(tId)[Strings.typeBreakdown.weakTo]],
        []
      );
      const resistsIds = mem.typeIds.reduce(
        (p, tId) => [...p, ...types.get(tId)[Strings.typeBreakdown.resists]],
        []
      );

      return [...types.keys()].reduce((p, v) => {
        const w = weakIds.filter((x) => x === v).length;
        const r = resistsIds.filter((x) => x === v).length;

        if (w > r) {
          p.weakCounts.set(v, [...p.weakCounts.get(v), mem.id]);
        } else if (w < r) {
          p.resistCounts.set(v, [...p.resistCounts.get(v), mem.id]);
        }

        return p;
      }, maps);
    },
    {
      weakCounts: new Map(typesMapEmpty.slice()),
      resistCounts: new Map(typesMapEmpty.slice())
    }
  );

  return [
    {
      key: Strings.typeBreakdown.weakTo,
      counts: weakCounts,
      goodCountModifier: Strings.scoreModifier.none
    },
    {
      key: Strings.typeBreakdown.resists,
      counts: resistCounts,
      goodCountModifier: Strings.scoreModifier.high
    },
    {
      key: Strings.typeBreakdown.unaffectedBy,
      counts: unaffectedCounts,
      goodCountModifier: Strings.scoreModifier.high
    }
  ];
}
// NEW WEAKNESS COUNTS

function buildGenerationCounts(members) {
  const genCounts = new Map([]);
  return members.reduce((result, mem) => {
    const value = result.has(mem.generation) ? result.get(mem.generation) : 0;

    return result.set(mem.generation, value + 1);
  }, genCounts);
}

function buildEvolutionFormCounts(members) {
  const counts = new Map([
    [EvolutionForms.notEvolved, 0],
    [EvolutionForms.fullyEvolved, 0]
  ]);

  return members.reduce((result, mem) => {
    const key = mem.evolutions.length
      ? EvolutionForms.notEvolved
      : EvolutionForms.fullyEvolved;

    const value = result.get(key);
    return result.set(key, value + 1);
  }, counts);
}

export function buildStatCounts(members) {
  const items = iterateMapToArray(members);
  return [
    {
      key: 'Generations',
      getKeyName: (val) => {
        const name = getKeyByValue(Generations, val);
        return separateAndCapitaliseAll(name);
      },
      counts: buildGenerationCounts(items)
    },
    {
      key: 'Evolutions',
      getKeyName: (val) => {
        const name = getKeyByValue(EvolutionForms, val);
        return separateAndCapitaliseAll(name);
      },
      counts: buildEvolutionFormCounts(items)
    }
  ];
}
