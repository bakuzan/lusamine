function constructNameClass(name) {
  return `sprite__pokemon--${name.replace(' ', '-')}`;
}

const indexToText = i => (i === 0 ? 'position-first' : 'position-second');
function constructTypeClasses(types) {
  return types
    .reduce((p, c, i) => `${p} sprite--${c.name}_${indexToText(i)}`, '')
    .trim();
}

export default function buildSelectorsForPokemon(data) {
  const types = constructTypeClasses(data.types);
  const name = constructNameClass(data.name);
  return {
    types,
    name
  };
}
