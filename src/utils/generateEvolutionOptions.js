import { evolvesToMatchedForm } from 'constants/evolutions';
import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';
import { iterateMapToArray } from 'utils/common';
import { merge, distinct } from 'utils/lists';

function formsForNPN(mons, npn) {
  return mons.filter(
    (x) =>
      x.nationalPokedexNumber === npn &&
      !isMegaPokemon(x) &&
      !isVariantPokemon(x)
  );
}

function includeForms(pokemon, initial) {
  const forms = initial.reduce(
    (p, x) => [...p, ...formsForNPN(pokemon, x.nationalPokedexNumber)],
    []
  );

  return distinct('id', merge(initial, forms));
}

function resolveVariantId(mon, rSuff, rnSuff) {
  let id = `v_${mon.evolvesTo}`;
  if (rSuff) {
    id += `_${rSuff}`;
  }
  if (rnSuff) {
    id += `_${rnSuff}`;
  }
  return id;
}

export default function generateEvolutionOptions(
  dex,
  data,
  exhaustive = false
) {
  const { nationalPokedexNumber: npn, evolutions } = data;
  const pokemon = iterateMapToArray(dex);
  const isMega = isMegaPokemon(data);
  const isVariant = isVariantPokemon(data);

  const potentialVariantId = isVariant ? data.id : `v_${npn}`;
  const variantExists = dex.has(potentialVariantId);
  const [rSuff, rNumSuff] = data.id.split('_').slice(2);

  // Gather all forms of pokemon
  let forms = [];
  if (exhaustive) {
    forms = formsForNPN(pokemon, npn);
  }

  // Get variants of current pokemon
  const variants = [data];
  if (variantExists && exhaustive) {
    const variant = dex.get(potentialVariantId);
    variants.push(variant);
  }

  // Check for mega or devolve from mega
  const megaIds = isMega
    ? [`p_${npn}`]
    : [`m_${npn}`, `m_${npn}x`, `m_${npn}y`];

  // Generate Evolution Ids
  const targetIds = evolutions.reduce((p, x) => {
    const vId = resolveVariantId(x, rSuff, rNumSuff);
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
          (isVariantPokemon(x) ||
            !dex.has(resolveVariantId(x, rSuff, rNumSuff))));

      return (
        canDevolveTo &&
        x.evolutions.some((e) => e.evolvesTo === npn) &&
        (!evolvesToMatchedForm.includes(x.nationalPokedexNumber) ||
          (evolvesToMatchedForm.includes(x.nationalPokedexNumber) &&
            x.form === data.form))
      );
    })
    .map((x) => x.id);

  const megas = [...megaIds]
    .map((pkmId) => [isMega ? 'Devolve to ' : 'Evolve to ', dex.get(pkmId)])
    .filter((x) => !!x[1]);

  let evolves = [...targetIds].reduce((p, pkmId) => {
    const [prefix, num] = pkmId.split('_');
    const pkmNPN = Number(num);
    const isV = prefix === 'v';

    const evos = pokemon.filter(
      (x) =>
        isV === isVariantPokemon(x) &&
        x.nationalPokedexNumber === pkmNPN &&
        (!evolvesToMatchedForm.includes(x.nationalPokedexNumber) ||
          (evolvesToMatchedForm.includes(x.nationalPokedexNumber) &&
            x.form === data.form))
    );

    return [...p, ...evos];
  }, []);

  evolves = exhaustive ? includeForms(pokemon, evolves) : evolves;

  const devolves = [...devolveIds].map((pkmId) => [
    'Devolve to ',
    dex.get(pkmId)
  ]);

  return {
    forms,
    devolves,
    evolves: evolves.map((x) => ['Evolve to ', x]),
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
