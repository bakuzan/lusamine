import { Utils } from 'meiko';
import Strings from 'constants/strings';

const defaultIdSuffix = o => o.nationalPokedexNumber;
const constructId = (c, fn = defaultIdSuffix) => obj => `${c}_${fn(obj)}`;

export const generatePokemonId = constructId(Strings.idPrefix.regular);
export const generateVariantPokemonId = constructId(Strings.idPrefix.variant);
export const generateMegaPokemonId = constructId(
  Strings.idPrefix.mega,
  o => `${o.nationalPokedexNumber}${o.suffix}`
);
export const generateEmptyPokemonId = constructId(Strings.idPrefix.empty, () =>
  Utils.Common.generateUniqueId()
);
