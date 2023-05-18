import { useEffect, useRef, useState } from 'react';
import type { Size } from '../core/types';

const INITIAL_SIZE: Size = [0, 0];

export interface UseSizeOptions {
  defaultSize?: Size;
  onResize?: (size: Size) => void;
}

export function useSize<E extends HTMLElement> ({
  defaultSize = INITIAL_SIZE,
}: UseSizeOptions = {}) {
  const ref = useRef<E>(null);

  const [size, setSize] = useState<Size>(defaultSize);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      // set current size
      const { width, height } = el.getBoundingClientRect();
      setSize([width, height]);

      // set size when change
      const mo = new ResizeObserver(([{ contentRect: { width, height } }]) => {
        setSize([width, height]);
      });
      mo.observe(el);

      return () => mo.disconnect();
    }
  }, []);

  return {
    ref,
    size,
  };
}