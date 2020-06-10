import { constructPokedex } from 'data';
import party from 'constants/party';

import {
  generateEmptySlots,
  isEmptyPokemon,
  isMegaPokemon,
  isVariantPokemon,
  isAltFormPokemon,
  isNotBasePokemon,
  isBasePokemon,
  hasForm,
  isVariantRegionMatch
} from 'utils/derivedData';

const { pokedex } = constructPokedex();

jest.mock('ayaka/generateUniqueId', () => {
  let idCount = 0;

  return jest.fn(() => `unique_id_${idCount++}`);
});

// generateEmptySlots

it('should return team map', () => {
  const result = generateEmptySlots();

  expect(result instanceof Map).toBe(true);
});

it('should return team of max party size', () => {
  const result = generateEmptySlots();

  expect(result.size).toEqual(party.MAX_SIZE);
});

// isEmptyPokemon

it('should return true for empty pokemon', () => {
  const mon = { nationalPokedexNumber: 0 };
  const result = isEmptyPokemon(mon);

  expect(result).toBe(true);
});

it('should return false for pokemon', () => {
  const mon = pokedex.get('p_1');
  const result = isEmptyPokemon(mon);

  expect(result).toBe(false);
});

// isMegaPokemon
it('should return true for mega pokemon', () => {
  const mon = pokedex.get('m_3');
  const result = isMegaPokemon(mon);

  expect(result).toBe(true);
});

// isVariantPokemon
it('should return true for variant pokemon', () => {
  const mon = pokedex.get('v_26');
  const result = isVariantPokemon(mon);

  expect(result).toBe(true);
});

// isAltFormPokemon
it('should return true for alternate form pokemon', () => {
  const mon = pokedex.get('p_382_1');
  const result = isAltFormPokemon(mon);

  expect(result).toBe(true);
});

// isNotBasePokemon
it('should return true when mega pokemon', () => {
  const mon = pokedex.get('m_3');
  const result = isNotBasePokemon(mon);

  expect(result).toBe(true);
});

it('should return true when variant pokemon', () => {
  const mon = pokedex.get('v_26');
  const result = isNotBasePokemon(mon);

  expect(result).toBe(true);
});

it('should return true when alternate form pokemon', () => {
  const mon = pokedex.get('p_382_1');
  const result = isNotBasePokemon(mon);

  expect(result).toBe(true);
});

// isBasePokemon
it('should return true when standard pokemon', () => {
  const mon = pokedex.get('p_13');
  const result = isBasePokemon(mon);

  expect(result).toBe(true);
});

// hasForm
it('should return true when pokemon has form', () => {
  const mon = pokedex.get('p_745_1');
  const result = hasForm(mon);

  expect(result).toBe(true);
});

it('should return false when pokemon does not have form', () => {
  const mon = pokedex.get('p_745');
  const result = hasForm(mon);

  expect(result).toBe(false);
});

// isVariantRegionMatch

it('should return true when pokemon are variants in same region', () => {
  const mon1 = pokedex.get('v_554_r8');
  const mon2 = pokedex.get('v_555_r8');

  const result = isVariantRegionMatch(mon1, mon2);

  expect(result).toBe(true);
});

it('should return false when one of the pokemon is not a variant', () => {
  const mon1 = pokedex.get('p_554');
  const mon2 = pokedex.get('v_555_r8');

  const result = isVariantRegionMatch(mon1, mon2);

  expect(result).toBe(false);
});

it('should return false when one the pokemon are of different regions', () => {
  const mon1 = pokedex.get('v_52_r8');
  const mon2 = pokedex.get('v_53');

  const result = isVariantRegionMatch(mon1, mon2);

  expect(result).toBe(false);
});
