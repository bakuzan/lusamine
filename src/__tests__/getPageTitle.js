import getPageTitleForCurrentPath, { RouteKeyWords } from 'utils/getPageTitle';

jest.mock('ayaka/capitalise', () => ({
  capitaliseEachWord: jest.fn((v) => v)
}));

it('should return default values if route does not have defined values', () => {
  const path = '/random-words';
  const search = '';

  const result = getPageTitleForCurrentPath(path, search);

  expect(result.pageTitle).not.toBe(undefined);
  expect(result.pageHeader).not.toBe(undefined);
  expect(result.pageDescription).not.toBe(undefined);
});

it('should return pageHeader without "Pokémon" ', () => {
  const path = '/random-words';
  const search = '';

  const result = getPageTitleForCurrentPath(path, search);

  expect(result.pageHeader).toEqual(result.pageTitle.replace('Pokémon ', ''));
});

// Specific routes
it('should return tailored page meta based on route', () => {
  const routes = [
    ...Object.keys(RouteKeyWords).map((key) => ({
      path: RouteKeyWords[key],
      search: ``
    })),
    { path: `teams`, search: `Trainer` }
  ];

  const defaultResult = getPageTitleForCurrentPath(`random`, ``);

  routes.forEach(({ path, search }) => {
    const result = getPageTitleForCurrentPath(path, search);

    expect(result.pageTitle).not.toEqual(defaultResult.pageTitle);
    expect(result.pageHeader).not.toEqual(defaultResult.pageHeader);
    expect(result.pageDescription).not.toEqual(defaultResult.pageDescription);
  });
});
