import { constructPokedex } from 'data';
import generateEvolutionOptions from 'utils/generateEvolutionOptions';

const { pokedex } = constructPokedex();

it('should return empty options for empty pokemon', () => {
  const mon = { nationalPokedexNumber: 0 };
  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.count()).toEqual(0);
  expect(result.forms.length).toEqual(0);
  expect(result.variants.length).toEqual(0);
});
