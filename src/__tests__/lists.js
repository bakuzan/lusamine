import { merge, distinct } from 'utils/lists';

it('should merge arrays', () => {
  const result = merge(['hello'], ['world']);

  expect(result).toEqual(['hello', 'world']);
});

it('should filter array to distinct items', () => {
  const items = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three' },
    { name: 'one' },
    { name: 'two' }
  ];

  const result = distinct('name', items);

  expect(result).toEqual([{ name: 'one' }, { name: 'two' }, { name: 'three' }]);
});
