import { useCallback, useEffect, useState } from 'react';
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
  const [ref, setRef] = useState<E | null>(null);

  const documentVisible = useWatchReactiveValue(reactiveDocumentVisible);

  useEffect(() => {
    if (ref) {
      const io = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting);
      }, {
        threshold: 0,
      });
      io.observe(ref);
      return () => io.disconnect();
    }
  }, [ref]);

  const refMethod = useCallback((element: E | null) => {
    setRef(element);
  }, []);

  return {
    ref: refMethod,
    visible: documentVisible && visible,
  };
}