import app from '@/store/features/app';
import store, { State } from '@/store/store';
import { useSelector } from 'react-redux';

let _registered = false;

if (typeof window !== 'undefined') {
  if (_registered) {
    document.addEventListener('visibilitychange', () => {
      store.dispatch(app.actions.updateVisible({ visible: document.visibilityState === 'visible' }));
    });
  }
}

export function useVisible<E extends Element> () {
  const documentVisible = useSelector<State, boolean>(state => state.app.visible);

  return {
    ref: () => {},
    visible: documentVisible,
  };
}