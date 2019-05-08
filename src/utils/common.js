import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';
import generateUniqueId from 'ayaka/generateUniqueId';
import isString from 'ayaka/isString';
import Store from 'ayaka/localStorage';
import Strings from 'constants/strings';
import SETTINGS_DEFAULTS from 'constants/settings';

export {
  capitalise,
  capitaliseEachWord,
  separateAndCapitalise,
  separateAndCapitaliseAll
} from 'ayaka/capitalise';

export { default as getKeyByValue } from 'ayaka/getKeyByValue';
export { default as objectsAreEqual } from 'ayaka/objectsAreEqual';
export { default as createListeners } from 'ayaka/createListeners';

export { isString, generateUniqueId };

export const getWindowScrollPosition = () =>
  window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

export function getUrlQueryStringAsObject(location) {
  if (!location.search) {
    return {};
  }

  return constructObjectFromSearchParams(location.search);
}

export function combineValuesIntoSet(idSet, newValue) {
  const ids = [...idSet];
  const values = newValue ? [...ids, newValue] : ids;
  return new Set(values);
}
export function createIdStringFromSet(idSet, newValue) {
  const values = combineValuesIntoSet(idSet, newValue);
  return Array.from(values).join(',');
}

export const createSetFromIdString = (str = '') =>
  str ? new Set(str.split(',')) : new Set([]);

export const iterateMapToArray = (m) => Array.from(m.values());
export const iterateKeysToArray = (m) => Array.from(m.keys());
export const iterateMapToArrayEntries = (m) => Array.from(m.entries());

export const swapArrayPositions = (arr, from, to) => {
  const list = arr.slice(0);
  const fromValue = list[from];
  list[from] = list[to];
  list[to] = fromValue;
  return list;
};

function arrayMove(x, from, to) {
  x.splice(to < 0 ? x.length + to : to, 0, x.splice(from, 1)[0]);
}
export const moveToNewArrayPosition = (arr, from, to) => {
  const list = arr.slice(0);
  arrayMove(list, from, to);
  return list;
};

export const teamsStore = new Store(Strings.savedTeamsStorage, {});
teamsStore.upgrade((teams) => {
  if (Object.keys(teams).length === 0) {
    return {};
  }

  const teamKeys = Object.keys(teams);
  const containsV1Data = teamKeys.some((k) => isString(teams[k]));
  if (containsV1Data) {
    return teamKeys.reduce((p, k) => {
      const data = teams[k];
      return {
        ...p,
        [k]: isString(data)
          ? { name: generateUniqueId(), idString: data }
          : data
      };
    }, {});
  } else {
    return teams;
  }
});

export const settingsStore = new Store(
  Strings.settingsStorage,
  SETTINGS_DEFAULTS
);
settingsStore.upgrade((d) => ({ ...SETTINGS_DEFAULTS, ...d }));

export function selectMembersFromPokedex(dex, memberIds) {
  return new Map(Array.from(memberIds).map((id) => [id, dex.get(id)]));
}

export function selectMembersFromPokedexAllowDuplicates(dex, memberIds) {
  return new Map(
    Array.from(memberIds).map((id, i) => {
      const customId = `${id}-d${i}`;
      return [customId, { ...dex.get(id), id: customId }];
    })
  );
}
