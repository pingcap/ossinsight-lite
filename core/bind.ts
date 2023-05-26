import { commit } from '@/app/(client)/api/layout/operations.client';
import { BatchCommands } from '@/core/commands';
import { ReactiveDashboardInstance } from '@/core/dashboard/reactive-dashboard-instance';
import { DashboardInstance } from '@/core/dashboard/type';
import { collections, singletons } from '@/packages/ui/hooks/bind/context';
import { BindingTypeEvent } from '@/packages/ui/hooks/bind/types';
import { LayoutConfigV1, LibraryItem } from '@/utils/types/config';
import { startTransition, TransitionFunction } from 'react';
import { debounceTime } from 'rxjs';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface SingletonsBindMap {
    appState: {
      saving: boolean
      loading: number
      fetchingConfig: boolean
    };

    currentDashboard: DashboardInstance | null;
  }
}

export const appState = singletons.add('appState', {
  saving: false,
  loading: 0,
  fetchingConfig: false,
});

export function startAppStateLoadingTransition (cb: TransitionFunction) {
  appState.update({
    ...appState.current,
    loading: appState.current.loading + 1,
  });
  startTransition(cb);
  appState.update({
    ...appState.current,
    loading: appState.current.loading - 1,
  });
}

export const dashboards = collections.add('dashboards');

export const library = collections.add('library');

export const commands = new BatchCommands();

export const currentDashboard = singletons.add('currentDashboard', null);

// Auto save library items
library.subscribeAll(([item, id, ev]) => {
  switch (ev) {
    case BindingTypeEvent.CREATED:
    case BindingTypeEvent.UPDATED:
      commands.add({
        type: 'update-library-item',
        id: id as string,
        payload: item,
      });
      break;
    case BindingTypeEvent.DELETED:
      commands.add({
        type: 'delete-library-item',
        id: id as string,
      });
      break;
  }
});

// Auto save dashboard items
dashboards.subscribeAll(([dashboard, id, ev]) => {
  if (ev === BindingTypeEvent.CREATED) {
    dashboard.addDisposeDependency(dashboard.items.subscribeAll(([item, id, ev]) => {
      switch (ev) {
        case BindingTypeEvent.CREATED:
        case BindingTypeEvent.UPDATED:
          commands.add({
            type: 'update-dashboard-item',
            dashboard: dashboard.name,
            id: id as string,
            payload: item,
          });
          break;
        case BindingTypeEvent.DELETED:
          commands.add({
            type: 'delete-dashboard-item',
            dashboard: dashboard.name,
            id: id as string,
          });
          break;
      }
    }));
  }
});

// Auto save changes in batch
commands.changed
  .pipe(debounceTime(1000))
  .subscribe(() => {
    appState.current.saving = true;
    appState.notify();
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
        appState.current.saving = false;
        appState.notify();
        commands.resume();
        if (commands.dirty) {
          commands.changed.next();
        }
      });
  });

async function syncConfig () {
  if (typeof window === 'undefined') {
    return;
  }

  console.debug('[config]: start syncing');
  const res = await fetch('/api/layout.json');
  if (res.ok) {
    const config: LayoutConfigV1 = await res.json();

    localStorage.setItem('widgets:library', JSON.stringify(config.library));
    localStorage.setItem('widgets:dashboards', JSON.stringify(config.dashboard));

    commands.inactiveScope(() => {
      for (let item of config.library) {
        const key = item.id ?? item.name;
        if (library.has(key)) {
          library.update(key, item);
        } else {
          library.add(key, item);
        }
      }
    });

    for (const [name, dashboardConfig] of Object.entries(config.dashboard)) {
      const dashboard = dashboards.getNullable(name);
      if (!dashboard) {
        dashboards.add(name, new ReactiveDashboardInstance(name, dashboardConfig));
      } else {
        dashboard.current.layout = dashboardConfig.layout;
        const items = dashboard.current.items;
        commands.inactiveScope(() => {
          for (let item of dashboardConfig.items) {
            if (items.has(item.id)) {
              items.update(item.id, item);
            } else {
              items.add(item.id, item);
            }
          }
        });
      }
    }
    console.debug('[config]: sync succeed', `${config.library.length} items`);
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}

function syncLocalConfig () {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const libraryString = localStorage.getItem('widgets:library');
  if (libraryString) {
    const items = JSON.parse(libraryString) as LibraryItem[];
    commands.inactiveScope(() => {
      for (let item of items) {
        const key = item.id ?? item.name;
        if (library.has(key)) {
          library.update(key, item);
        } else {
          library.add(key, item);
        }
      }
    });
  }
}

syncLocalConfig();

appState.update({
  ...appState.current,
  fetchingConfig: true,
});

startTransition(() => {
  syncConfig()
    .catch(console.error)
    .finally(() => {
      appState.update({
        ...appState.current,
        fetchingConfig: false,
      });
    });
});
