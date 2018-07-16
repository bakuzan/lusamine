import { Utils } from 'meiko';
import Strings from 'constants/strings';

const { Common } = Utils;

export const {
  capitalise,
  capitaliseEachWord,
  separateAndCapitalise,
  separateAndCapitaliseAll,
  getKeyByValue
} = Common;

export const generateUniqueId = Common.generateUniqueId;

export const getWindowScrollPosition = () =>
  window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

export const getUrlQueryStringAsObject = location => {
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

export const iterateMapToArray = m => Array.from(m.values());
export const iterateKeysToArray = m => Array.from(m.keys());
export const iterateMapToArrayEntries = m => Array.from(m.entries());

export const swapArrayPositions = (arr, from, to) => {
  const list = arr.slice(0);
  const fromValue = list[from];
  list[from] = list[to];
  list[to] = fromValue;
  return list;
};

export const getSavedTeams = () =>
  Common.getObjectFromLocalStorageByProperty(Strings.savedTeamsStorage);

export const saveTeams = Common.persistObjectToLocalStorage(
  Strings.savedTeamsStorage
);

export const replaceTeams = teams => {
  const data = JSON.stringify(teams);
  localStorage.setItem(Strings.savedTeamsStorage, data);
  return teams;
};

export function selectMembersFromPokedex(dex, memberIds) {
  return new Map(Array.from(memberIds).map(id => [id, dex.get(id)]));
}
