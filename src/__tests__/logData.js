import { constructPokedex, getTypeMatchups } from 'data';
import logData from 'utils/logData';

const { pokedex, regions } = constructPokedex();
const typeMatchups = getTypeMatchups();

it('should log stuff', () => {
  const grpColSpy = jest
    .spyOn(console, 'groupCollapsed')
    .mockImplementation(() => null);

  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => null);

  const grpEndSpy = jest
    .spyOn(console, 'groupEnd')
    .mockImplementation(() => null);

  logData({ pokedex, regions, typeMatchups });

  expect(grpColSpy).toHaveBeenCalled();
  expect(logSpy).toHaveBeenCalledTimes(4);
  expect(grpEndSpy).toHaveBeenCalled();
});
