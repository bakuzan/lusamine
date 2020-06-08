import { isMegaPokemon } from 'utils/derivedData';

export default function getMegaEvolutions(dex, data) {
  const { nationalPokedexNumber: npn } = data;
  const isMega = isMegaPokemon(data);

  const megaIds = isMega
    ? [`p_${npn}`]
    : [`m_${npn}`, `m_${npn}x`, `m_${npn}y`];

  return [...megaIds]
    .map((pkmId) => [isMega ? 'Devolve to ' : 'Evolve to ', dex.get(pkmId)])
    .filter((x) => !!x[1]);
}
