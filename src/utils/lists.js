export function merge(...a) {
  return a.reduce((p, c) => [...p, ...c], []);
}

export function distinct(k, a) {
  return a.filter((b, i, arr) => arr.findIndex((c) => c[k] === b[k]) === i);
}
