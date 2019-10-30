import generateUniqueId from 'ayaka/generateUniqueId';
import Strings from 'constants/strings';

const defaultIdSuffix = (o) => o.nationalPokedexNumber;
const constructId = (c, fn = defaultIdSuffix) => (dataMap, obj) => {
  let num = 0;
  let id = `${c}_${fn(obj)}`;

  while (dataMap && dataMap.has(id)) {
    num += 1;
    id = `${c}_${fn(obj)}_${num}`;
  }

  return id;
};

export const generatePokemonId = constructId(Strings.idPrefix.regular);
export const generateVariantPokemonId = constructId(Strings.idPrefix.variant);
export const generateMegaPokemonId = constructId(
  Strings.idPrefix.mega,
  (o) => `${o.nationalPokedexNumber}${o.suffix}`
);
export const generateEmptyPokemonId = (id) =>
  constructId(Strings.idPrefix.empty, () => generateUniqueId())(null, id);
