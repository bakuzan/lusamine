import IdPrefixes from 'constants/id-prefixes';

const getIdPrefix = id => id.split('_')[0];

export default function sortCombinedData([aId, a], [bId, b]) {
  const aNPN = a.nationalPokedexNumber;
  const bNPN = b.nationalPokedexNumber;
  if (aNPN < bNPN) return -1;
  if (aNPN > bNPN) return 1;

  const aPrefix = getIdPrefix(aId);
  const bPrefix = getIdPrefix(bId);
  const aEnum = IdPrefixes[aPrefix];
  const bEnum = IdPrefixes[bPrefix];
  if (aEnum < bEnum) return -1;
  if (aEnum > bEnum) return 1;
  return 0;
}
