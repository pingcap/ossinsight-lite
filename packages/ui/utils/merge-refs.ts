import { ForwardedRef } from 'react';

export default function mergeRefs<T> (...refs: (ForwardedRef<T> | undefined | null)[]): (instance: T | null) => void {
  return (instance) => {
    for (let ref of refs) {
      if (ref) {
        if (typeof ref === 'function') {
          ref(instance);
        } else {
          ref.current = instance;
        }
      }
    }
  };
}
