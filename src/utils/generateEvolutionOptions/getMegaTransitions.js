import { isMegaPokemon, isVariantPokemon } from 'utils/derivedData';

export default function getMegaTransitions(dex, data) {
  const { nationalPokedexNumber: npn } = data;

  if (isVariantPokemon(data)) {
    return [];
  }

  const isMega = isMegaPokemon(data);
  const megaIds = isMega
    ? [`p_${npn}`]
    : [`m_${npn}`, `m_${npn}x`, `m_${npn}y`];

  return [...megaIds]
    .map((pkmId) => [isMega ? 'Devolve to ' : 'Evolve to ', dex.get(pkmId)])
    .filter((x) => !!x[1]);
}
