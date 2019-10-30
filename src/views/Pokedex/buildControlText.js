import { capitaliseEachWord } from 'ayaka/capitalise';

export default function buildControlText(dex, dexOptions, activeId) {
  const index = dexOptions.findIndex((x) => x.value === activeId);

  return [-1, 1].map((direction) => {
    const data = dexOptions[index + direction];

    if (!data) {
      return { label: 'End of pokedex', text: '' };
    }

    const mon = dex.get(data.value);

    const isPre = direction < 0;
    const pref = isPre ? '< ' : '';
    const suff = isPre ? '' : ' >';

    const npn = mon.nationalPokedexNumber;
    const monName = capitaliseEachWord(mon.name);

    const text = `${pref}#${npn} - ${monName}${suff}`;
    const label = `Go to #${npn}, ${monName}`;

    return { label, text };
  });
}
