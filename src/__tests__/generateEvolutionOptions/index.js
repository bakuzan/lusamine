import { constructPokedex } from 'data';
import generateEvolutionOptions from 'utils/generateEvolutionOptions';

const { pokedex } = constructPokedex();

// Setup...

const evolvesTo = (...mons) => mons.map((x) => ['Evolve to ', x]);
const devolvesTo = (...mons) => mons.map((x) => ['Devolve to ', x]);

// Tests

it('should return empty options for empty pokemon', () => {
  const mon = { nationalPokedexNumber: 0 };
  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual([]);
  expect(result.count()).toEqual(0);
  expect(result.forms.length).toEqual(0);
  expect(result.variants.length).toEqual(0);
});

it('should return options for pokemon (level 1)', () => {
  const mon = pokedex.get('p_1');
  const expected = evolvesTo(pokedex.get('p_2'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(1);
});

it('should return options for pokemon (level 2)', () => {
  const mon = pokedex.get('p_2');
  const expected = [
    ...devolvesTo(pokedex.get('p_1')),
    ...evolvesTo(pokedex.get('p_3'))
  ];

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(1);
});

it('should return options for pokemon (level 3)', () => {
  const mon = pokedex.get('p_3');
  const expected = [
    ...devolvesTo(pokedex.get('p_2')),
    ...evolvesTo(pokedex.get('m_3'))
  ];

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
  expect(result.megas.length).toEqual(1);
});

it('should return options for pokemon (only mega evolution)', () => {
  const mon = pokedex.get('p_115');
  const expected = evolvesTo(pokedex.get('m_115'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(0);
  expect(result.megas.length).toEqual(1);
});

it('should return options for pokemon (no evolution)', () => {
  const mon = pokedex.get('p_145');
  const expected = [];

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(0);
  expect(result.megas.length).toEqual(0);
});

it('should return options for mega pokemon (with lower levels)', () => {
  const mon = pokedex.get('m_181');
  const expected = devolvesTo(pokedex.get('p_181'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(0);
  expect(result.megas.length).toEqual(1);
});

it('should return options for mega pokemon (no lower levels)', () => {
  const mon = pokedex.get('m_303');
  const expected = devolvesTo(pokedex.get('p_303'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(0);
  expect(result.megas.length).toEqual(1);
});

it('should return options for regional variant (with regional evolution)', () => {
  const mon = pokedex.get('v_37');
  const expected = evolvesTo(pokedex.get('v_38'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(1);
  expect(result.variants.length).toEqual(1);
});

it('should return options for regional variant (with regional devolution)', () => {
  const mon = pokedex.get('v_38');
  const expected = devolvesTo(pokedex.get('v_37'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
  expect(result.variants.length).toEqual(1);
});

it('should return options for regional variant (with no regional devolution)', () => {
  const mon = pokedex.get('v_103');
  const expected = devolvesTo(pokedex.get('p_102'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
  expect(result.variants.length).toEqual(1);
});

it('should return options for pokemon (with regional evolution)', () => {
  const mon = pokedex.get('p_25');
  const expected = [
    ...devolvesTo(pokedex.get('p_172')),
    ...evolvesTo(pokedex.get('p_26'), pokedex.get('v_26'))
  ];

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(2);
});

// Special pokemon specific cases...

it(`should return options for pokemon (with regional evolution - sirfetch'd case)`, () => {
  const mon = pokedex.get('p_865');
  const expected = devolvesTo(pokedex.get('v_83_r8'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
});

it('should return options for regional variant (evolve to regular pokemon - meowth case)', () => {
  const mon = pokedex.get('v_52_r8');
  const expected = evolvesTo(pokedex.get('p_863'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(1);
});

it('should return options for pokemon (devolve to regional variant - meowth case)', () => {
  const mon = pokedex.get('p_863');
  const expected = devolvesTo(pokedex.get('v_52_r8'));

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
});

it('should return options for form pokemon (evolve to form pokemon - shellos case)', () => {
  let mon = pokedex.get('p_422');
  let expected = evolvesTo(pokedex.get('p_423'));

  let result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(1);

  mon = pokedex.get('p_422_1');
  expected = evolvesTo(pokedex.get('p_423_1'));

  result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(1);
});

it('should return options for form pokemon (devolve to form pokemon - shellos case)', () => {
  let mon = pokedex.get('p_423');
  let expected = devolvesTo(pokedex.get('p_422'));

  let result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);

  mon = pokedex.get('p_423_1');
  expected = devolvesTo(pokedex.get('p_422_1'));

  result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
});

it('should return options for form pokemon (evolve to form pokemon - burmy case)', () => {
  const tests = Array(3)
    .fill(null)
    .map((_, i) => {
      const n = i ? `_${i}` : '';

      return {
        mon: pokedex.get(`p_412${n}`),
        expected: evolvesTo(pokedex.get(`p_413${n}`), pokedex.get('p_414'))
      };
    });

  tests.forEach(({ mon, expected }) => {
    const result = generateEvolutionOptions(pokedex, mon);

    expect(result.asList()).toEqual(expected);
    expect(result.count()).toEqual(expected.length);
    expect(result.devolves.length).toEqual(0);
    expect(result.evolves.length).toEqual(2);
  });
});

it('should return options for form pokemon (devolve to form pokemon - burmy case)', () => {
  const tests = Array(3)
    .fill(null)
    .map((_, i) => {
      const n = i ? `_${i}` : '';

      return {
        mon: pokedex.get(`p_413${n}`),
        expected: devolvesTo(pokedex.get(`p_412${n}`))
      };
    });

  tests.forEach(({ mon, expected }) => {
    const result = generateEvolutionOptions(pokedex, mon);

    expect(result.asList()).toEqual(expected);
    expect(result.count()).toEqual(expected.length);
    expect(result.devolves.length).toEqual(1);
    expect(result.evolves.length).toEqual(0);
  });
});

it('should return options for pokemon (evolve to many form pokemon - lycanroc case)', () => {
  const mon = pokedex.get(`p_744`);
  const expected = evolvesTo(
    pokedex.get(`p_745`),
    pokedex.get(`p_745_1`),
    pokedex.get(`p_745_2`)
  );

  const result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(3);
});

it('should return options for form pokemon (devolve to pokemon - lycanroc case)', () => {
  const mons = [
    pokedex.get(`p_745`),
    pokedex.get(`p_745_1`),
    pokedex.get(`p_745_2`)
  ];

  mons.forEach((mon) => {
    const expected = devolvesTo(pokedex.get(`p_744`));

    const result = generateEvolutionOptions(pokedex, mon);

    expect(result.asList()).toEqual(expected);
    expect(result.count()).toEqual(expected.length);
    expect(result.devolves.length).toEqual(1);
    expect(result.evolves.length).toEqual(0);
  });
});

it('should return options for pokemon (evolve to matching variant type pokemon - darmanitan case)', () => {
  let mon = pokedex.get('p_554');
  let expected = evolvesTo(pokedex.get('p_555'));

  let result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(1);

  mon = pokedex.get('v_554_r8');
  expected = evolvesTo(pokedex.get('v_555_r8'));

  result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(1);
});

it('should return options for form pokemon (devolve to matching variant type pokemon, evolve to form pokemon - darmanitan case)', () => {
  let mon = pokedex.get('p_555');
  let expected = [
    ...devolvesTo(pokedex.get('p_554')),
    ...evolvesTo(pokedex.get('p_555_1'))
  ];

  let result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(1);

  mon = pokedex.get('v_555_r8');
  expected = [
    ...devolvesTo(pokedex.get('v_554_r8')),
    ...evolvesTo(pokedex.get('v_555_r8_1'))
  ];

  result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(1);
});

it('should return options for form pokemon (devolve to matching variant type pokemon, base pokemon - darmanitan case)', () => {
  let mon = pokedex.get('p_555_1');
  let expected = devolvesTo(pokedex.get('p_555'));

  let result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);

  mon = pokedex.get('v_555_r8_1');
  expected = devolvesTo(pokedex.get('v_555_r8'));

  result = generateEvolutionOptions(pokedex, mon);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
});

// Exhaustive
it('should return options for pokemon (exhaustive)', () => {
  const mon = pokedex.get('p_52');
  const expected = evolvesTo(
    pokedex.get('p_53'),
    pokedex.get('v_53'),
    pokedex.get('p_863')
  );

  const result = generateEvolutionOptions(pokedex, mon, true);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(0);
  expect(result.evolves.length).toEqual(3);
  expect(result.variants.length).toEqual(3);
});

it('should return options for pokemon (exhaustive, with devolves)', () => {
  const mon = pokedex.get('p_53');
  const expected = devolvesTo(pokedex.get('p_52'), pokedex.get('v_52'));

  const result = generateEvolutionOptions(pokedex, mon, true);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(2);
  expect(result.evolves.length).toEqual(0);
  expect(result.variants.length).toEqual(2);
});

it('should return options for variant pokemon (do not return mega options)', () => {
  const mon = pokedex.get('v_80_r8');
  const expected = devolvesTo(pokedex.get('v_79_r8'));

  const result = generateEvolutionOptions(pokedex, mon, true);

  expect(result.asList()).toEqual(expected);
  expect(result.count()).toEqual(expected.length);
  expect(result.devolves.length).toEqual(1);
  expect(result.evolves.length).toEqual(0);
  expect(result.variants.length).toEqual(2);
  expect(result.megas.length).toEqual(0);
});
