import { use, useMemo } from 'react';

export function useGet (url: string): Response {
  const fetched = useMemo(() => {
    return fetch(url);
  }, [url]);

  return use(fetched);
}

export function useGetText (url: string): string {
  const resp = useGet(url);

  const text = useMemo(() => {
    return resp.text();
  }, [resp]);

  return use(text);
}