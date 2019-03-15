import Strings from 'constants/strings';
import Generations from 'constants/generations';
import { EvolutionForms } from 'constants/evolutions';
import {
  iterateMapToArray,
  separateAndCapitaliseAll,
  getKeyByValue
} from 'utils/common';

export function buildTeamWeaknessCounts(types, members) {
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

function buildGenerationCounts(members) {
  const genCounts = new Map([]);
  return members.reduce((result, mem) => {
    const values = result.has(mem.generation) ? result.get(mem.generation) : [];

    return result.set(mem.generation, [...values, mem.id]);
  }, genCounts);
}

function buildEvolutionFormCounts(members) {
  const counts = new Map([
    [EvolutionForms.notEvolved, []],
    [EvolutionForms.fullyEvolved, []]
  ]);

  return members.reduce((result, mem) => {
    const key = mem.evolutions.length
      ? EvolutionForms.notEvolved
      : EvolutionForms.fullyEvolved;

    const values = result.get(key);
    return result.set(key, [...values, mem.id]);
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
