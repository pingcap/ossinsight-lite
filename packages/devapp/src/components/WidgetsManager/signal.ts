import { PureCallback } from '@oss-widgets/ui/hooks/bind/types';
import { useCallback, useEffect, useMemo } from 'react';
import { Subject } from 'rxjs';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';

export function useSignal (cb: PureCallback): PureCallback {
  const subject = useMemo(() => new Subject<void>(), []);
  cb = useRefCallback(cb);

  const signal = useCallback(() => {
    subject.next();
  }, []);

  useEffect(() => {
    const sub = subject.subscribe(() => cb());

    return () => sub.unsubscribe();
  }, []);

  return signal;
}
