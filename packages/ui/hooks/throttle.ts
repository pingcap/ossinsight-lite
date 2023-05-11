import { useRef } from 'react';
import useRefCallback from './ref-callback.ts';

export function useThrottleIdle (cb: () => void): () => void {
  const handleRef = useRef<{
    idle?: ReturnType<typeof requestIdleCallback>
    timeout?: ReturnType<typeof setTimeout>
  }>({});

  return useRefCallback(() => {
    clearTimeout(handleRef.current.timeout);
    cancelIdleCallback(handleRef.current.idle);
    handleRef.current.timeout = setTimeout(() => {
      handleRef.current.idle = requestIdleCallback(() => {
        cb();
      }, { timeout: 1000 });
    }, 500);
  });
}
