import { useEffect, useState } from 'react';

export function useWindowVerticallyScrolling () {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const listener = () => {
      setScrolling(window.scrollY > 0);
    };

    window.addEventListener('scroll', listener, { passive: true });
    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, []);

  return scrolling;
}