import {
  capitalise,
  capitaliseEachWord,
  separateAndCapitalise,
  separateAndCapitaliseAll,
  getKeyByValue,
  objectsAreEqual,
  generateUniqueId,
  persistObjectToLocalStorage,
  getObjectFromLocalStorageByProperty
} from 'meiko-lib';
import Strings from 'constants/strings';
import SETTINGS_DEFAULTS from 'constants/settings';

export {
  capitalise,
  capitaliseEachWord,
  separateAndCapitalise,
  separateAndCapitaliseAll,
  getKeyByValue,
  objectsAreEqual,
  generateUniqueId
};

export const getWindowScrollPosition = () =>
  window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

export const getUrlQueryStringAsObject = (location) => {
  if (!location.search) return {};
  return location.search
    .slice(1)
    .split('&')
    .reduce((obj, str) => {
      const [key, value] = str.split('=');
      obj[key] = decodeURIComponent(value);
      return obj;
    }, {});
};

export function createIdStringFromSet(idSet, newValue) {
  const ids = [...idSet];
  const values = newValue ? [...ids, newValue] : ids;
  return Array.from(new Set(values)).join(',');
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

export const getSavedTeams = () =>
  getObjectFromLocalStorageByProperty(Strings.savedTeamsStorage);

export const saveTeams = persistObjectToLocalStorage(Strings.savedTeamsStorage);

export const replaceTeams = (teams) => {
  const data = JSON.stringify(teams);
  localStorage.setItem(Strings.savedTeamsStorage, data);
  return teams;
};

export const getSettings = () =>
  getObjectFromLocalStorageByProperty(Strings.settingsStorage) ||
  SETTINGS_DEFAULTS;

export const saveSettings = persistObjectToLocalStorage(
  Strings.settingsStorage
);

export function selectMembersFromPokedex(dex, memberIds) {
  return new Map(Array.from(memberIds).map((id) => [id, dex.get(id)]));
}
