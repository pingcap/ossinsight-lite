import { useEffect, useState } from 'react';

export const enum AsyncIntervalState {
  SCHEDULED,
  RUNNING,
  READY,
}

export function useAsyncInterval (run: (signal: AbortSignal) => Promise<void>, interval: number) {
  const [state, setState] = useState(AsyncIntervalState.SCHEDULED);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const controller = new AbortController();
    let th: ReturnType<typeof setTimeout>;

    const execute = () => {
      setState(AsyncIntervalState.RUNNING);
      run(controller.signal)
        .then(() => {
          if (controller.signal.aborted) {
            return;
          }
          setError(undefined);
        })
        .catch(err => {
          if (controller.signal.aborted) {
            return;
          }
          setError(err);
        })
        .finally(() => {
          if (controller.signal.aborted) {
            return;
          }
          setState(AsyncIntervalState.READY);
          schedule();
        });
    };

    const schedule = () => {
      th = setTimeout(() => {
        execute();
      }, interval);
    };

    execute();

    return () => {
      clearTimeout(th);
      controller.abort('unmount');
    };
  }, []);

  return { state, error };
}
