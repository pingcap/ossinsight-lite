import { useCallback, useRef } from 'react';

export default function useRefCallback<T extends (...args: any[]) => any> (cb: T): T {
  const ref = useRef(cb);
  ref.current = cb;

  return useCallback((...args: any[]): any => {
    return ref.current(...args);
  }, []) as T;
}
