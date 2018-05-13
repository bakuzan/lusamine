import IdPrefixes from 'constants/id-prefixes';

const getIdPrefix = id => id.split('_')[0];

export default function sortCombinedData(a, b) {
  const aNPN = a.nationalPokedexNumber;
  const bNPN = b.nationalPokedexNumber;
  if (aNPN < bNPN) return 1;
  if (aNPN > bNPN) return -1;

  const aId = getIdPrefix(a.id);
  const bId = getIdPrefix(b.id);
  const aEnum = IdPrefixes[aId];
  const bEnum = IdPrefixes[bId];
  if (aEnum < bEnum) return 1;
  if (aEnum > bEnum) return -1;
  return 0;
}
