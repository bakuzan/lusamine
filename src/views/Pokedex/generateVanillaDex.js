import { iterateMapToArray, capitaliseEachWord } from 'utils/common';
import {
  isMegaPokemon,
  isVariantPokemon,
  isAltFormPokemon
} from 'utils/derivedData';

export default function generateVanillaDex(dex) {
  const values = iterateMapToArray(dex);
  const basePokemon = values.filter(
    (x) => !(isMegaPokemon(x) || isVariantPokemon(x) || isAltFormPokemon(x))
  );

  let lastId = 0;
  const baseDex = basePokemon.reduce((p, c) => {
    const id = c.id;
    lastId = id;
    return p.set(id, c);
  }, new Map([]));

  return {
    baseDex,
    dexOptions: iterateMapToArray(baseDex).map((x) => ({
      value: x.id,
      text: `${capitaliseEachWord(x.name)} (#${x.nationalPokedexNumber})`
    })),
    lastId
  };
}
