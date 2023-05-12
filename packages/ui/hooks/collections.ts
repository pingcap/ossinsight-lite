import useMono from './constant.ts';

export function useMap<K, V> () {
  return useMono(() => new Map<K, V>);
}
