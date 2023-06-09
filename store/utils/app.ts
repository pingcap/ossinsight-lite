import { isAppBusy } from '../features/app';
import store from '../store';

export function requestAppIdle (cb: () => void) {
  if (!isAppBusy(store.getState())) {
    cb();
    return () => {};
  }

  const unsubscribe = store.subscribe(() => {
    if (!isAppBusy(store.getState())) {
      cb();
      unsubscribe();
    }
  });

  return unsubscribe;
}
