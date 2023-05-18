import { useRef } from 'react';
import useRefCallback from './ref-callback';

export function useThrottleIdle<T> (cb: (arg: T[]) => void): (arg: T) => void {
  const args = useRef<T[]>([])

  const handleRef = useRef<{
    idle?: ReturnType<typeof requestIdleCallback>
    timeout?: ReturnType<typeof setTimeout>
  }>({});

  return useRefCallback((arg: T) => {
    args.current.push(arg);
    clearTimeout(handleRef.current.timeout);
    if (typeof handleRef.current.idle === 'number') {
      cancelIdleCallback(handleRef.current.idle);
    }
    handleRef.current.timeout = setTimeout(() => {
      handleRef.current.idle = requestIdleCallback(() => {
        cb(args.current);
        args.current = [];
      }, { timeout: 1000 });
    }, 500);
  });
}
