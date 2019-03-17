import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';
import { iterateMapToArray } from 'utils/common';

export default function generateEvolutionOptions(dex, data) {
  const { nationalPokedexNumber: npn, evolutions } = data;
  const pokemon = iterateMapToArray(dex);
  const isMega = isMegaPokemon(data);
  const isVariant = isVariantPokemon(data);

  // Check for mega or devolve from mega
  const megaIds = isMega
    ? [`p_${npn}`]
    : [`m_${npn}`, `m_${npn}x`, `m_${npn}y`];

  // Generate Evolution Ids
  const targetIds = evolutions.map(
    (x) => (isVariant ? `v_${x.evolvesTo}` : `p_${x.evolvesTo}`)
  );

  // Walk devolution tree
  const devolveIds = pokemon
    .filter((x) => x.evolutions.some((e) => e.evolvesTo === npn))
    .map((x) => x.id);

  const megas = [...megaIds]
    .map((pkmId) => [isMega ? 'Devolve to ' : 'Evolve to ', dex.get(pkmId)])
    .filter((x) => !!x[1]);
  const evolves = [...targetIds].map((pkmId) => ['Evolve to ', dex.get(pkmId)]);
  const devolves = [...devolveIds].map((pkmId) => [
    'Devolve to ',
    dex.get(pkmId)
  ]);

  return [...devolves, ...evolves, ...megas];
}
