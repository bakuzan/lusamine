import { constructPokedex } from 'data';
import {
  buildSelectorsForArtCard,
  buildSelectorsForSprite
} from 'utils/selectors';

const { pokedex } = constructPokedex();

it('should return classes for pokemon art card', () => {
  const mon = pokedex.get('p_1');

  const result = buildSelectorsForArtCard(mon);

  expect(result.name).toEqual('art-card__pokemon--bulbasaur');
  expect(result.types).toEqual(
    'art-card--grass_position-first art-card--poison_position-second'
  );
});

it('should return classes for pokemon sprite card', () => {
  const mon = pokedex.get('p_1');

  const result = buildSelectorsForSprite(mon);

  expect(result.name).toEqual('sprite__pokemon--bulbasaur');
  expect(result.types).toEqual(
    'sprite--grass_position-first sprite--poison_position-second'
  );
});

// Mega cases

it('should return classes for pokemon art card mega', () => {
  const mon = pokedex.get('m_9');

  const result = buildSelectorsForArtCard(mon);

  expect(result.name).toEqual('art-card__pokemon--blastoise-mega');
  expect(result.types).toEqual('art-card--water_position-first');
});

it('should return classes for pokemon art card mega x', () => {
  const mon = pokedex.get('m_6x');

  const result = buildSelectorsForArtCard(mon);

  expect(result.name).toEqual('art-card__pokemon--charizard-mega-x');
  expect(result.types).toEqual(
    'art-card--fire_position-first art-card--dragon_position-second'
  );
});

it('should return classes for pokemon art card mega y', () => {
  const mon = pokedex.get('m_6y');

  const result = buildSelectorsForArtCard(mon);

  expect(result.name).toEqual('art-card__pokemon--charizard-mega-y');
  expect(result.types).toEqual(
    'art-card--fire_position-first art-card--flying_position-second'
  );
});

// Variant cases

it('should return classes for pokemon art card variant', () => {
  const mon = pokedex.get('v_28');

  const result = buildSelectorsForArtCard(mon);

  expect(result.name).toEqual('art-card__pokemon--sandslash-alola');
  expect(result.types).toEqual(
    'art-card--ice_position-first art-card--steel_position-second'
  );
});

// Form cases

it('should return classes for pokemon art card with form', () => {
  const mon = pokedex.get('p_745_1');

  const result = buildSelectorsForArtCard(mon);

  expect(result.name).toEqual('art-card__pokemon--lycanroc-midnight');
  expect(result.types).toEqual('art-card--rock_position-first');
});
