import { useMemo } from 'react';

export default function useMono<T> (fn: () => T): T {
  return useMemo(fn, []);
}
