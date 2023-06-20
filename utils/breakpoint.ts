import { BreakpointName, Responsive } from '@/utils/layout';
import { useEffect, useMemo, useState } from 'react';

export function useBreakpoint (breakpoints: Responsive<number>, ssrFallback: BreakpointName) {
  const [width, setWidth] = useState(breakpoints[ssrFallback]);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const medias = useMemo(() => {
    return Object.entries(breakpoints)
      .sort((a, b) => b[1] - a[1])
      .map(([bp, size]) => [bp, typeof matchMedia === 'undefined' ? { matches: true } : matchMedia(`(min-width: ${size}px)`)] as const);
  }, [breakpoints]);

  const bp = useMemo(() => {
    if (typeof matchMedia === 'undefined') {
      return ssrFallback;
    }
    for (let [name, media] of medias) {
      if (media.matches) {
        return name;
      }
    }

    return ssrFallback;
  }, [medias, width]);

  return bp as BreakpointName;
}