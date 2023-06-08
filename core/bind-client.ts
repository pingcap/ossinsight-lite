import { commit } from '@/app/(client)/api/layout/operations.client';
import { commands } from '@/core/bind';
import { ResolvedWidgetModule } from '@/core/widgets-manifest';
import app from '@/store/features/app';
import store from '@/store/store';
import { startTransition, TransitionFunction } from 'react';
import { debounceTime } from 'rxjs';

if (typeof window !== 'undefined') {
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = (cb) => {
      return setTimeout(cb, 0);
    };
    window.cancelIdleCallback = clearTimeout;
  }
}

export function startAppStateLoadingTransition (cb: TransitionFunction) {
  store.dispatch(app.actions.startLoading());
  startTransition(cb);
  store.dispatch(app.actions.stopLoading());
}

if (typeof window !== 'undefined') {
  void fetch('/api/refresh-token');

  setInterval(() => {
    if (document.visibilityState !== 'hidden') {
      void fetch('/api/refresh-token');
    }
  }, 5 * 60 * 1000);
}

// Auto save changes in batch
commands.changed
  .pipe(debounceTime(1000))
  .subscribe(() => {
    store.dispatch(app.actions.startSaving());
    const cmds = commands.merge();

    commands.pause();
    console.debug('[config] start saving', cmds);
    commit(cmds)
      .then(store => {
        const succeed = Object.values(store).findIndex(val => Object.is(val, true)) !== -1;
        if (succeed) {
          console.debug('[config] saved', store);
        } else {
          console.warn('[config] save failed', store);
        }
      })
      .catch(err => {
        console.error('[config] save failed', err);
        // Reset commands state, wait for next save action.
        commands.insert(cmds);
      })
      .finally(() => {
        store.dispatch(app.actions.stopSaving());
        commands.resume();
        if (commands.dirty) {
          commands.changed.next();
        }
      });
  });
