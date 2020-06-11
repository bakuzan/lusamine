import { media, isXS } from 'utils/media';

it('should have breakpoint keys', () => {
  expect(media.size).toEqual(3);

  const options = ['xsmall', 'small', 'large'];

  options.forEach((key) => {
    const fn = media.get(key);

    expect(typeof fn).toEqual('function');
    expect(typeof fn(100)).toEqual('boolean');
  });
});

it('should return xsmall function', () => {
  expect(isXS).toEqual(media.get('xsmall'));
});
