import { noDataOptions, WidgetContextDataOptionsValues } from '@/packages/ui/context/widget';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useWidgetGetData } from '@/store/features/widgets';
import { useState } from 'react';

export function useDataOptions (name: string, id: string): WidgetContextDataOptionsValues {
  const hasGetData = useWidgetGetData(name);
  if (!hasGetData) {
    return noDataOptions;
  }

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  return {
    data,
    requestingData: loading,
    onRequestData: useRefCallback(async (abort) => {
      setError(null);
      setLoading(true);
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
    }),
    requestDataError: error,
  };
}