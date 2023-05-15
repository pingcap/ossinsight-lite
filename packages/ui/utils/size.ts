import { useEffect, useRef, useState } from 'react';

export type ElementSize = {
  width: number
  height: number
}

const zeroSize: ElementSize = {
  width: 0,
  height: 0,
};

export interface UseSizeOption {
  defaultSize?: ElementSize;
  parent?: boolean;
}

export function useSize<Element extends HTMLElement | SVGElement> ({ defaultSize, parent = false }: UseSizeOption = {}) {
  const [size, setSize] = useState(defaultSize ?? zeroSize);

  const ref = useRef<Element | null>();

  useEffect(() => {
    const el = parent ? ref.current?.parentElement : ref.current;
    if (el) {
      const { width, height } = el.getBoundingClientRect();
      setSize({ width, height });

      const ro = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      });

      ro.observe(el);

      return () => ro.disconnect();
    }
  }, [parent]);

  return {
    size, ref,
  };
}
