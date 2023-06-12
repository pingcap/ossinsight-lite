import { commit } from '@/app/(client)/api/layout/operations.client';
import { Command, merge } from '@/core/commands';
import app from '@/store/features/app';
import dashboards from '@/store/features/dashboards';
import draft from '@/store/features/draft';
import library from '@/store/features/library';
import store from '@/store/store';
import { startTransition, TransitionFunction } from 'react';
import { debounceTime, Subject } from 'rxjs';

if (typeof window !== 'undefined') {
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = (cb) => {
      return setTimeout(cb, 0);
    };
    window.cancelIdleCallback = clearTimeout;
  }
}

/**
 * @deprecated
 */
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

const dirtySubject = new Subject<void>();

// TODO: use middleware?
store.subscribe(() => {
  const { library: { commands: libraryCommands }, dashboards: { commands: dashboardCommands } } = store.getState();
  let commands: Command[] = [];
  if (libraryCommands.length > 0) {
    commands.push(...libraryCommands);
    store.dispatch(library.actions.clearCommands());
  }
  if (dashboardCommands.length > 0) {
    commands.push(...dashboardCommands);
    store.dispatch(dashboards.actions.clearCommands());
  }
  if (commands.length > 0) {
    store.dispatch(draft.actions.add({ command: commands }));
    dirtySubject.next();
  }
});

dirtySubject
  .pipe(debounceTime(1000))
  .subscribe(() => {
    const state = store.getState();
    if (state.draft.committing.length > 0) {
      // if committing, schedule next run
      dirtySubject.next();
      return;
    }
    store.dispatch(app.actions.startSaving());
    const commands = merge([...state.draft.localStorageUncommittedChanges, ...state.draft.dirty]);
    store.dispatch(draft.actions.startCommitting());

    console.debug('[ossl] start committing chages', commands);
    commit(commands)
      .then((result) => {
        console.debug('[ossl] committed', result);
        if (result.tidb) {
          store.dispatch(draft.actions.commit({ clearUncommitted: true }));
        } else if (result.localStorage) {
          store.dispatch(draft.actions.addLocalStorageUncommittedChanges({ commands }));
          store.dispatch(draft.actions.commit({ clearUncommitted: false }));
        } else {
          return Promise.reject('save failed.');
        }
      })
      .catch(error => {
        console.error('[ossl] rollback', error);
        store.dispatch(draft.actions.rollback());
      })
      .finally(() => {
        store.dispatch(app.actions.stopSaving());
      });
  });
