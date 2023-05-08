import { useLayoutEffect, useRef, useState, ElementRef, useEffect } from 'react';

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
}

export function useSize <Element extends HTMLElement>({ defaultSize }: UseSizeOption = {}) {
  const [size, setSize] = useState(defaultSize ?? zeroSize);

  const ref = useRef<Element | null>();

  useEffect(() => {
    const el = ref.current;
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
  }, []);

  return {
    size, ref,
  };
}
