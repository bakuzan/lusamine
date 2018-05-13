import { Utils } from 'meiko';

const defaultIdSuffix = o => o.nationalPokedexNumber;
const constructId = (c, fn = defaultIdSuffix) => obj => `${c}_${fn(obj)}`;

export const generatePokemonId = constructId('p');
export const generateVariantPokemonId = constructId('v');
export const generateMegaPokemonId = constructId(
  'm',
  o => `${o.nationalPokedexNumber}${o.suffix}`
);
export const generateEmptyPokemonId = constructId('e', () =>
  Utils.Common.generateUniqueId()
);
