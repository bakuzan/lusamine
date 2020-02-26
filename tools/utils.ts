import { ScrapeOption } from './types/ScrapeOption';
import Enums from './enums';

export function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

export function getFirstValidAttributeValue(
  $: CheerioStatic,
  items: ScrapeOption[]
) {
  for (const item of items) {
    const value = $(item.selector).attr(item.attr);
    if (value) {
      return value;
    }
  }

  throw new Error('Not valid value found');
}

export function filterFalsey<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

const MATCH_ALOLA_FORM = /\d{1,}A.*MS.png$/;
const MATCH_GALAR_FORM = /\d{1,}G.*MS.png$/;

export function checkImgForVariant(td: Cheerio) {
  const src = td
    .children()
    .first()
    .children()
    .first()
    .attr('src');

  if (src && src.match(MATCH_ALOLA_FORM)) {
    return Enums.Regions.alola;
  } else if (src && src.match(MATCH_GALAR_FORM)) {
    return Enums.Regions.galar;
  }

  return false;
}
