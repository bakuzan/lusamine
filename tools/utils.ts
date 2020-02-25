import { ScrapeOption } from './types/ScrapeOption';

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
