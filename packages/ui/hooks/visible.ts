import { useEffect, useRef, useState } from 'react';
import { isSSR } from '../utils/ssr';
import { useWatchReactiveValue } from './bind';
import { ReactiveValueSubject } from './bind/ReactiveValueSubject';

const reactiveDocumentVisible = new ReactiveValueSubject(true);
let _registered = false;

if (!isSSR && !_registered) {
  _registered = true;
  document.addEventListener('visibilitychange', () => {
    reactiveDocumentVisible.update(document.visibilityState === 'visible');
  });
}

export function useVisible<E extends Element> () {
  const [visible, setVisible] = useState(isSSR);
  const ref = useRef<E | null>(null);

  const documentVisible = useWatchReactiveValue(reactiveDocumentVisible);

  useEffect(() => {
    if (ref.current) {
      const io = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting);
      }, {
        threshold: 0,
      });
      io.observe(ref.current);
      return () => io.disconnect();
    }
  }, []);

  return {
    ref,
    visible: documentVisible && visible,
  };
}