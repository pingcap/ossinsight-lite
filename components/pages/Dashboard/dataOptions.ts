import { noDataOptions, WidgetContextDataOptionsValues } from '@/packages/ui/context/widget';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useWidgetGetData } from '@/store/features/widgets';
import { requestAppIdle } from '@/store/utils/app';
import { useEffect, useRef, useState } from 'react';

export function useDataOptions (name: string, id: string): WidgetContextDataOptionsValues {
  const hasGetData = useWidgetGetData(name);
  if (!hasGetData) {
    return noDataOptions;
  }

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const lastAbort = useRef<AbortController>();

  useEffect(() => {
    return () => {
      lastAbort.current?.abort('unmounted');
    };
  }, [name, id]);

  return {
    data,
    requestingData: loading,
    onRequestData: useRefCallback(async (abort) => {
      lastAbort.current = abort;
      setLoading(true);
      setError(null);
      requestAppIdle(async () => {
        try {
          const res = await fetch(`/widgets/${encodeURIComponent(id)}/data.json`, {
            signal: abort?.signal,
          });
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }
          setData(await res.json());
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      });
    }),
    requestDataError: error,
  };
}