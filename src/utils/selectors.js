const constructNameClass = className => name => {
  return `${className}__pokemon--${name.replace(' ', '-')}`;
};

const constructNameClassForSprite = constructNameClass('sprite');

const constructNameClassForArtCard = constructNameClass('art-card');

const indexToText = i => (i === 0 ? 'position-first' : 'position-second');
const constructTypeClasses = className => types => {
  return types
    .reduce((p, c, i) => `${p} ${className}--${c.name}_${indexToText(i)}`, '')
    .trim();
};

const constructTypeClassesForSprite = constructTypeClasses('sprite');

const constructTypeClassesForArtCard = constructTypeClasses('art-card');

export function buildSelectorsForSprite(data) {
  const types = constructTypeClassesForSprite(data.types);
  const name = constructNameClassForSprite(data.name);
  return {
    types,
    name
  };
}

export function buildSelectorsForArtCard(data) {
  const types = constructTypeClassesForArtCard(data.types);
  const name = constructNameClassForArtCard(data.name);
  return {
    types,
    name
  };
}
