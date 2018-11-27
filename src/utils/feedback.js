import { generateUniqueId } from './common';

export function getPartySizeAlertMessage() {
  return {
    id: generateUniqueId(),
    type: 'error',
    message: 'Maximum party size reached',
    detail: 'To add another pokemon, please remove one from your team first'
  };
}
