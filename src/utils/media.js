export const media = new Map([
  ['xsmall', (n) => n <= 600],
  ['small', (n) => n <= 991],
  ['large', (n) => n > 991]
]);

export const isXS = media.get('xsmall');
