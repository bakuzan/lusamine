import groupBy from 'utils/groupBy';

it('should group values into a map', () => {
  const values = [1, 2, 3, 1, 2];

  const result = groupBy(values);

  expect(result.get(1).length).toEqual(2);
  expect(result.get(2).length).toEqual(2);
  expect(result.get(3).length).toEqual(1);
});

it('should group values into a map with custom key getter', () => {
  const values = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 1 }, { num: 2 }];

  const result = groupBy(values, (x) => x.num);

  expect(result.get(1).length).toEqual(2);
  expect(result.get(2).length).toEqual(2);
  expect(result.get(3).length).toEqual(1);
});
