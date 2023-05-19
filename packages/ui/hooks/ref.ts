import { useEffect, useRef } from 'react';

export function useLatestValueRef<T> (value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
}

export function useFirstValue<T> (value: T) {
  return useRef(value).current;
}
