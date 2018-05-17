import { Utils } from 'meiko';

const { Common } = Utils;

export const getWindowScrollPosition = () =>
  window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

export const capitaliseEachWord = str =>
  str
    .split(' ')
    .map(Common.capitalise)
    .join(' ');

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
  const values = newValue ? [...idSet, newValue] : [...idSet];
  return Array.from(new Set(values)).join(',');
}

export const createSetFromIdString = (str = '') =>
  str ? new Set(str.split(',')) : new Set([]);

export const iterateMapToArray = m => Array.from(m.values());

export const iterateKeysToArray = m => Array.from(m.keys());

export const swapArrayPositions = (arr, from, to) => {
  const list = arr.slice(0);
  const fromValue = list[from];
  list[from] = list[to];
  list[to] = fromValue;
  return list;
};
