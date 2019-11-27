import { useState, useCallback, useLayoutEffect } from 'react';

function addEvent(event, cb) {
  window.addEventListener(event, cb);
  return () => window.removeEventListener(event, cb);
}

export function useDimensions() {
  const [dimensions, setDimensions] = useState({});
  const [node, setNode] = useState(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      function measure() {
        window.requestAnimationFrame(() =>
          setDimensions(node.getBoundingClientRect())
        );
      }

      measure();

      const removeResize = addEvent('resize', measure);

      return () => {
        removeResize();
      };
    }
  }, [node]);

  return [ref, dimensions, node];
}
