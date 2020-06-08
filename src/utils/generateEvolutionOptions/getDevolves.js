import orderBy from 'ayaka/orderBy';
import { evolvesToMatchedForm } from 'constants/evolutions';
import { isVariantPokemon, isVariantRegionMatch } from 'utils/derivedData';
import { iterateMapToArray } from 'utils/common';

import { orderKeys, resolveVariantId } from './helpers';

export default function getDevolves(dex, data, exhaustive) {
  const { nationalPokedexNumber: npn, generation } = data;
  const isVariant = isVariantPokemon(data);
  const [rSuff, rNumSuff] = data.id.split('_').slice(2);

  const devolves = iterateMapToArray(dex).filter((x) => {
    const nonVariantMatch =
      !isVariant &&
      (!isVariantPokemon(x) ||
        (isVariantPokemon(x) &&
          x.evolutions.some((e) => e.evolvesTo === npn && e.regionId)) ||
        exhaustive);

    const variantMatch =
      isVariant &&
      (isVariantRegionMatch(data, x) ||
        !dex.has(resolveVariantId(x.nationalPokedexNumber, rSuff, rNumSuff)));

    const matchedFormCondition =
      !evolvesToMatchedForm.includes(x.nationalPokedexNumber) ||
      (evolvesToMatchedForm.includes(x.nationalPokedexNumber) &&
        x.form === data.form);

    const hasRegional = x.evolutions.some((e) => e.regionId);
    const hasEvolutionCondition = x.evolutions.some(
      (e) => e.evolvesTo === npn && (!hasRegional || e.regionId === generation)
    );

    return (
      (nonVariantMatch || variantMatch) &&
      hasEvolutionCondition &&
      matchedFormCondition
    );
  });

  return orderBy(devolves, orderKeys).map((x) => ['Devolve to ', x]);
}
