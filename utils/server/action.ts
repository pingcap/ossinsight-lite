import { useCallback, useState, useTransition } from 'react';

export type ServerAction<Fn extends (...args: any[]) => Promise<void>> = {
  running: boolean
  error: unknown
  action: (...args: Parameters<Fn>) => Promise<void>
}

export function useServerAction<Fn extends (...args: any[]) => Promise<void>> (fn: Fn): ServerAction<Fn> {
  const [transition, startTransition] = useTransition();
  const [error, setError] = useState<unknown>();

  return {
    error,
    running: transition,
    action: useCallback((...args) => {
      return new Promise((resolve) => {
        startTransition(() => {
          setError(undefined);
          fn(...args).then(resolve).catch(e => setError(e));
        });
      })
    }, [fn]),
  };
}