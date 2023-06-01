import { use } from 'react';

let _cache: Record<string, Promise<Response>> = {};
let _cacheText: Record<string, Promise<string>> = {};

export function useGet (url: string): Response {
  let res: Promise<Response>;
  if (_cache[url]) {
    res = _cache[url];
  } else {
    res = _cache[url] = fetch(url);
  }

  return use(res);
}

export function useGetText (url: string): string {
  const resp = useGet(url);
  let text: Promise<string>;

  if (_cacheText[url]) {
    text = _cacheText[url];
  } else {
    text = _cacheText[url] = resp.text();
  }

  return use(text);
}