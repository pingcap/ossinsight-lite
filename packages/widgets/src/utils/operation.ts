import { useCallback, useEffect, useRef, useState } from 'react';

export type OperationOptions<P, T> = {
  (props: P, signal: AbortSignal): Promise<T>
}

export type OperationResult<P, T> = {
  execute (props: P): void
  abort (reason?: string): void
  error: unknown | undefined
  running: boolean
  result: T | null
}

export function useOperation<P, T> (action: OperationOptions<P, T>): OperationResult<P, T> {
  const actionRef = useRef(action);
  actionRef.current = action;
  const [result, setResult] = useState<T>(null);
  const [error, setError] = useState<unknown>(undefined);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController>();

  const execute = useCallback((prop: P) => {
    abortRef.current?.abort();
    const controller = abortRef.current = new AbortController();
    setTimeout(() => {
      setResult(null);
      setError(undefined);
      setRunning(true);
      return actionRef.current(prop, controller.signal)
        .then(res => {
          setResult(res);
          return res;
        })
        .catch(err => {
          if (err?.name === 'AbortError') {
            return;
          }
          setError(err);
          return Promise.reject(err);
        })
        .finally(() => {
          setRunning(false);
        });
    }, 0)
  }, []);

  const abort = useCallback((reason?: string) => {
    abortRef.current?.abort(reason);
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort('component unmount');
    };
  }, []);

  return {
    execute,
    abort,
    result,
    error,
    running,
  };
}