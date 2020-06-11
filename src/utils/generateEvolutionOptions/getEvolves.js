import orderBy from 'ayaka/orderBy';
import { evolvesToMatchedForm, excludeAltForm } from 'constants/evolutions';
import {
  isVariantPokemon,
  isVariantRegionMatch,
  isAltFormPokemon,
  isBasePokemon,
  hasForm
} from 'utils/derivedData';
import { iterateMapToArray } from 'utils/common';

import { includeForms, orderKeys } from './helpers';

export default function getEvolves(dex, data, exhaustive) {
  const { nationalPokedexNumber: npn, evolutions: baseEvolutions } = data;
  const pokemon = iterateMapToArray(dex);
  const isVariant = isVariantPokemon(data);
  const hasAForm = hasForm(data);
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
          (isVariant === isVariantRegionMatch(data, m) || x.regionId)
      );

      const hasV = vs.some(isVariantPokemon);

      let xMons = [];
      if (isVariant && !exhaustive) {
        xMons = vs.filter((v) => hasV === isVariantPokemon(v));
      } else if (hasV && (!regionals.length || exhaustive)) {
        xMons = vs;
      } else {
        xMons = vs.filter((x) => isBasePokemon(x) || isAltFormPokemon(x));
      }

      const evos = xMons.filter(
        (x) =>
          (!evolvesToMatchedForm.includes(x.nationalPokedexNumber) &&
            !(excludeAltForm.includes(x.nationalPokedexNumber) && x.form)) ||
          (evolvesToMatchedForm.includes(x.nationalPokedexNumber) &&
            x.form === data.form)
      );

      return [...p, ...evos];
    }, []);

  // Special temporary state "sideways" evolves
  // E.g. Darmanitan -> Darmanitan (Zen)
  if (!exhaustive && excludeAltForm.includes(npn)) {
    evolves.push(
      ...pokemon.filter(
        (m) =>
          npn === m.nationalPokedexNumber &&
          isVariant === isVariantPokemon(m) &&
          !hasAForm &&
          hasAForm !== hasForm(m)
      )
    );
  }

  evolves = exhaustive ? includeForms(pokemon, evolves) : evolves;
  return orderBy(evolves, orderKeys).map((x) => ['Evolve to ', x]);
}
