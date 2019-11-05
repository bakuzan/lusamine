const defaultGetter = (x) => x;

export default function groupBy(list, keyGetter = defaultGetter) {
  const map = new Map();

  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return map;
}
