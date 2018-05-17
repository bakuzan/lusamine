const MEGA = 'mega-';
const MEGA_X = '-x';
const MEGA_Y = '-y';
const ALOLA = 'alola-';

const constructNameClass = className => name => {
  let pokemonName = name
    .replace(/ /g, '-')
    .replace(/[.':]/g, '')
    .replace(/♂/g, '-male')
    .replace(/♀/g, '');
  if (pokemonName.includes(MEGA)) {
    pokemonName = `${pokemonName.replace(MEGA, '')}-mega`;
    if (pokemonName.includes(MEGA_X)) {
      pokemonName = `${pokemonName.replace(MEGA_X, '')}-x`;
    } else if (pokemonName.includes(MEGA_Y)) {
      pokemonName = `${pokemonName.replace(MEGA_Y, '')}-y`;
    }
  } else if (pokemonName.includes(ALOLA)) {
    pokemonName = `${pokemonName.replace(ALOLA, '')}-alola`;
  }
  return `${className}__pokemon--${pokemonName}`;
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
