import { useState, useEffect } from 'react';

import createListeners from 'ayaka/createListeners';

const up = 'ArrowUp';
const down = 'ArrowDown';
const left = 'ArrowLeft';
const right = 'ArrowRight';
const b = 'KeyB';
const a = 'KeyA';
const konami = [up, up, down, down, left, right, left, right, b, a];

export function useKonami() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    function onKeyDown(e) {
      const code = e.code;
      if (konami.includes(code)) {
        setQueue((p) => [...p, code]);
      } else {
        setQueue([]);
      }
    }

    const listeners = createListeners('keydown', onKeyDown)();
    listeners.listen();

    return () => listeners.remove();
  }, []);

  const queueLastTen = queue.slice(-10);
  return [konami.every((x, i) => x === queueLastTen[i]), () => setQueue([])];
}
