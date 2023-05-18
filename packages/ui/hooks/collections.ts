import useMono from './constant';

export function useMap<K, V> () {
  return useMono(() => new Map<K, V>);
}
