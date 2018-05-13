import { Utils } from 'meiko';

const { Common } = Utils;

export const getWindowScrollPosition = () =>
  window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

export const capitaliseEachWord = str =>
  str
    .split(' ')
    .map(Common.capitalise)
    .join(' ');
