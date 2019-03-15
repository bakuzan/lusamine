import { useState, useEffect } from 'react';

import { createListeners } from 'meiko-lib';

const up = 38;
const down = 40;
const left = 37;
const right = 39;
const b = 66;
const a = 65;
const konami = [up, up, down, down, left, right, left, right, b, a];

export function useKonami() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    function onKeyDown(e) {
      const keyCode = e.keyCode;
      if (konami.includes(keyCode)) {
        setQueue((p) => [...p, keyCode]);
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
