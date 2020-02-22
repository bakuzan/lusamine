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

function resolveVariantId(npn, rSuff, rnSuff) {
  let id = `v_${npn}`;
  if (rSuff) {
    id += `_${rSuff}`;
  }
  if (rnSuff) {
    id += `_${rnSuff}`;
  }
  return id;
}

function getMegaEvolutions(dex, data) {
  const { nationalPokedexNumber: npn } = data;
  const isMega = isMegaPokemon(data);

  const megaIds = isMega
    ? [`p_${npn}`]
    : [`m_${npn}`, `m_${npn}x`, `m_${npn}y`];

  return [...megaIds]
    .map((pkmId) => [isMega ? 'Devolve to ' : 'Evolve to ', dex.get(pkmId)])
    .filter((x) => !!x[1]);
}

function getDevolves(dex, data, exhaustive) {
  const { nationalPokedexNumber: npn } = data;
  const isVariant = isVariantPokemon(data);
  const [rSuff, rNumSuff] = data.id.split('_').slice(2);

  const devolves = iterateMapToArray(dex).filter((x) => {
    const nonVariantMatch =
      !isVariant &&
      (!isVariantPokemon(x) ||
        (isVariantPokemon(x) &&
          x.evolutions.some((e) => e.evolvesTo === npn)) ||
        exhaustive);

    const variantMatch =
      isVariant &&
      (isVariantPokemon(x) ||
        !dex.has(resolveVariantId(x.nationalPokedexNumber, rSuff, rNumSuff)));

    const matchedFormCondition =
      !evolvesToMatchedForm.includes(x.nationalPokedexNumber) ||
      (evolvesToMatchedForm.includes(x.nationalPokedexNumber) &&
        x.form === data.form);

    if (x.nationalPokedexNumber === 52)
      console.log(
        data,
        'Test devolve > ',
        x,
        variantMatch,
        resolveVariantId(x.nationalPokedexNumber, rSuff, rNumSuff)
      );
    return (
      (nonVariantMatch || variantMatch) &&
      x.evolutions.some((e) => e.evolvesTo === npn) &&
      matchedFormCondition
    );
  });

  return devolves.map((x) => ['Devolve to ', x]);
}

function getEvolves(dex, data, exhaustive) {
  const { nationalPokedexNumber: npn, evolutions } = data;
  const pokemon = iterateMapToArray(dex);
  const isVariant = isVariantPokemon(data);
  const [rSuff, rNumSuff] = data.id.split('_').slice(2);

  const regionals = pokemon.filter(
    (x) => x.nationalPokedexNumber === npn && isVariantPokemon(x)
  );

  const variantExists = regionals.length > 0;

  const targetIds = evolutions.reduce((p, x) => {
    const vId = resolveVariantId(x.evolvesTo, rSuff, rNumSuff);
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
  return evolves.map((x) => ['Evolve to ', x]);
}

export default function generateEvolutionOptions(
  dex,
  data,
  exhaustive = false
) {
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
    forms,
    megas: getMegaEvolutions(dex, data),
    variants,
    asList() {
      return [...this.devolves, ...this.evolves, ...this.megas];
    },
    count() {
      return this.asList().length;
    }
  };
}
