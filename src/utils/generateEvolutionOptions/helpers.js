import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';
import { merge, distinct } from 'utils/lists';

export const orderKeys = ['nationalPokedexNumber', 'id'];

export function formsForNPN(mons, npn) {
  return mons.filter(
    (x) =>
      x.nationalPokedexNumber === npn &&
      !isMegaPokemon(x) &&
      !isVariantPokemon(x)
  );
}

export function includeForms(pokemon, initial) {
  const forms = initial.reduce(
    (p, x) => [...p, ...formsForNPN(pokemon, x.nationalPokedexNumber)],
    []
  );

  return distinct('id', merge(initial, forms));
}

export function resolveVariantId(npn, rSuff, rnSuff) {
  let id = `v_${npn}`;
  if (rSuff) {
    id += `_${rSuff}`;
  }
  if (rnSuff) {
    id += `_${rnSuff}`;
  }
  return id;
}
