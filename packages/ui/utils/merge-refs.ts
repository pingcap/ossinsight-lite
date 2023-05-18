import { ForwardedRef, LegacyRef, MutableRefObject } from 'react';

export default function mergeRefs<T> (...refs: (ForwardedRef<T> | LegacyRef<T> | undefined | null)[]): (instance: T | null) => void {
  return (instance) => {
    for (let ref of refs) {
      if (ref) {
        if (typeof ref === 'function') {
          ref(instance);
        } else {
          (ref as MutableRefObject<T | null>).current = instance;
        }
      }
    }
  };
}
