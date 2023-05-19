import { useCallback } from 'react';
import { useLatestValueRef } from './ref.ts';

export default function useRefCallback<T extends (...args: any[]) => any> (cb: T | undefined): T {
  const latestCbRef = useLatestValueRef(cb);

  return useCallback((...args: any[]): any => {
    return latestCbRef.current?.(...args);
  }, []) as T;
}
