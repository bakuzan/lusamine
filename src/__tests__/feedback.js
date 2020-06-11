import { getPartySizeAlertMessage } from 'utils/feedback';

jest.mock('ayaka/generateUniqueId', () => {
  let idCount = 0;

  return jest.fn(() => `unique_id_${idCount++}`);
});

it('should return party size message', () => {
  const result = getPartySizeAlertMessage();

  expect(typeof result).toEqual('object');
  expect(result.type).toEqual('error');
});
