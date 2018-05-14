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

export const createSetFromIdString = str =>
  new Set(str.split(',').map(o => Number(o)));
