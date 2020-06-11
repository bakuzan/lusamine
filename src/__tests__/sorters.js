import { constructPokedex } from 'data';

import sortingMapEntries from 'utils/sorters';

const { pokedex } = constructPokedex();

const keysToEntries = (...arr) => arr.map((id) => [id, pokedex.get(id)]);

it('should order pokemon by nationalPokedexNumber', () => {
  const pokemon = keysToEntries('p_4', 'p_2', 'p_1', 'p_3');

  const result = pokemon.sort(sortingMapEntries);

  expect(result.map((x) => x[0])).toEqual(['p_1', 'p_2', 'p_3', 'p_4']);
});

it('should tie-break ordered pokemon by id prefix', () => {
  const pokemon = keysToEntries('v_52', 'p_53', 'p_52', 'v_53', 'v_52_r8');

  const result = pokemon.sort(sortingMapEntries);

  expect(result.map((x) => x[0])).toEqual([
    'p_52',
    'v_52',
    'v_52_r8',
    'p_53',
    'v_53'
  ]);
});
