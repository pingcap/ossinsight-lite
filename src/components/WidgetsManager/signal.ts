import { Consume } from '@ossinsight-lite/ui/hooks/bind/types';
import { useCallback, useEffect, useMemo } from 'react';
import { Subject } from 'rxjs';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';

export function useSignal<T> (cb: Consume<T>): Consume<T> {
  const subject = useMemo(() => new Subject<T>(), []);
  cb = useRefCallback(cb);

  const signal = useCallback((value: T) => {
    subject.next(value);
  }, []);

  useEffect(() => {
    const sub = subject.subscribe((v) => cb(v));

    return () => sub.unsubscribe();
  }, []);

  return signal;
}
