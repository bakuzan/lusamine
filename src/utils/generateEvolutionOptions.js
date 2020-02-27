import orderBy from 'ayaka/orderBy';
import { evolvesToMatchedForm } from 'constants/evolutions';
import {
  isMegaPokemon,
  isVariantPokemon,
  isVariantRegionMatch,
  isAltFormPokemon,
  isEmptyPokemon
} from 'utils/derivedData';
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

    return (
      (nonVariantMatch || variantMatch) &&
      x.evolutions.some((e) => e.evolvesTo === npn) &&
      matchedFormCondition
    );
  });

  return orderBy(devolves, ['nationalPokedexNumber', 'id']).map((x) => [
    'Devolve to ',
    x
  ]);
}

function getEvolves(dex, data, exhaustive) {
  const { nationalPokedexNumber: npn, evolutions: baseEvolutions } = data;
  const pokemon = iterateMapToArray(dex);
  const isVariant = isVariantPokemon(data);
  let evolutions = [...baseEvolutions];

  const regionals = pokemon.filter(
    (x) => x.nationalPokedexNumber === npn && isVariantPokemon(x)
  );

  if (exhaustive) {
    const otherEvos = regionals.reduce((p, c) => [...p, ...c.evolutions], []);
    evolutions = [...evolutions, ...otherEvos].filter(
      (o, i, arr) =>
        arr.findIndex(
          (x) => x.evolvesTo === o.evolvesTo && x.regionId === o.regionId
        ) === i
    );
  }

  const hasRegional = evolutions.some((e) => e.regionId);
  let evolves = evolutions
    .filter((e) => exhaustive || !hasRegional || (hasRegional && e.regionId))
    .reduce((p, x) => {
      const vs = pokemon.filter(
        (m) =>
          m.nationalPokedexNumber === x.evolvesTo &&
          !isAltFormPokemon(m) &&
          (isVariant === isVariantRegionMatch(data, m) || x.regionId)
      );

      const hasV = vs.some((v) => isVariantPokemon(v));

      let xMons = [];
      if (isVariant && !exhaustive) {
        xMons = vs.filter((v) => hasV === isVariantPokemon(v));
      } else if (hasV && (!regionals.length || exhaustive)) {
        xMons = vs;
      } else {
        xMons = vs.filter((v) => !isVariantPokemon(v));
      }

      const evos = xMons.filter(
        (x) =>
          !evolvesToMatchedForm.includes(x.nationalPokedexNumber) ||
          (evolvesToMatchedForm.includes(x.nationalPokedexNumber) &&
            x.form === data.form)
      );

      return [...p, ...evos];
    }, []);

  evolves = exhaustive ? includeForms(pokemon, evolves) : evolves;
  return orderBy(evolves, ['nationalPokedexNumber', 'id']).map((x) => [
    'Evolve to ',
    x
  ]);
}

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
