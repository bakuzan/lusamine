import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';
import { iterateMapToArray } from 'utils/common';

export default function generateEvolutionOptions(
  dex,
  data,
  exhaustive = false
) {
  const { nationalPokedexNumber: npn, evolutions } = data;
  const pokemon = iterateMapToArray(dex);
  const isMega = isMegaPokemon(data);
  const isVariant = isVariantPokemon(data);
  const variantExists = dex.has(`v_${npn}`);

  const variants = [data];
  if (variantExists && exhaustive) {
    const variant = dex.get(`v_${npn}`);
    variants.push(variant);
  }

  // Check for mega or devolve from mega
  const megaIds = isMega
    ? [`p_${npn}`]
    : [`m_${npn}`, `m_${npn}x`, `m_${npn}y`];

  // Generate Evolution Ids
  const targetIds = evolutions.reduce((p, x) => {
    const vId = `v_${x.evolvesTo}`;
    const pId = `p_${x.evolvesTo}`;
    const hasV = dex.has(vId);

    let xIds = [];
    if (isVariant && !exhaustive) {
      xIds = [vId];
    } else if (hasV && (!variantExists || exhaustive)) {
      xIds = [pId, vId];
    } else {
      xIds = [pId];
    }

    return [...p, ...xIds];
  }, []);

  // Walk devolution tree
  const devolveIds = pokemon
    .filter((x) => {
      const canDevolveTo =
        (!isVariant && (!isVariantPokemon(x) || exhaustive)) ||
        (isVariant &&
          (isVariantPokemon(x) || !dex.has(`v_${x.nationalPokedexNumber}`)));

      return canDevolveTo && x.evolutions.some((e) => e.evolvesTo === npn);
    })
    .map((x) => x.id);

  const megas = [...megaIds]
    .map((pkmId) => [isMega ? 'Devolve to ' : 'Evolve to ', dex.get(pkmId)])
    .filter((x) => !!x[1]);

  const evolves = [...targetIds].map((pkmId) => ['Evolve to ', dex.get(pkmId)]);
  const devolves = [...devolveIds].map((pkmId) => [
    'Devolve to ',
    dex.get(pkmId)
  ]);

  return {
    devolves,
    evolves,
    megas,
    variants,
    asList() {
      return [...this.devolves, ...this.evolves, ...this.megas];
    },
    count() {
      return this.asList().length;
    }
  };
}
