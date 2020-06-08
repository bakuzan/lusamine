import orderBy from 'ayaka/orderBy';

import { isVariantPokemon, isEmptyPokemon } from 'utils/derivedData';
import { iterateMapToArray } from 'utils/common';

import getEvolves from './getEvolves';
import getDevolves from './getDevolves';
import getMegaEvolves from './getMegaEvolves';
import { formsForNPN, orderKeys } from './helpers';

export default function generateEvolutionOptions(
  dex,
  data,
  exhaustive = false
) {
  if (isEmptyPokemon(data)) {
    return {
      devolves: [],
      evolves: [],
      forms: [],
      megas: [],
      variants: [],
      asList() {
        return [];
      },
      count() {
        return 0;
      }
    };
  }

  const variants = [data];
  let forms = [];

  if (exhaustive) {
    const { nationalPokedexNumber: npn } = data;
    const pokemon = iterateMapToArray(dex);

    const regionals = pokemon.filter(
      (x) => x.nationalPokedexNumber === npn && isVariantPokemon(x)
    );

    variants.push(...regionals);
    forms = formsForNPN(pokemon, npn);
  }

  return {
    devolves: getDevolves(dex, data, exhaustive),
    evolves: getEvolves(dex, data, exhaustive),
    forms: orderBy(forms, orderKeys),
    megas: getMegaEvolves(dex, data),
    variants: orderBy(variants, orderKeys),
    asList() {
      return [...this.devolves, ...this.evolves, ...this.megas];
    },
    count() {
      return this.asList().length;
    }
  };
}
