import { collections, singletons } from '@/packages/ui/hooks/bind/context';
import { BatchCommands } from '@/src/core/commands';
import { BindingTypeEvent } from '@/packages/ui/hooks/bind/types';
import { debounceTime } from 'rxjs';
import { commit } from '@/app/(client)/api/layout/operations.client';
import { LayoutConfigV1, LibraryItem } from '@/src/types/config';
import { ReactiveDashboardInstance } from '@/src/core/dashboard/reactive-dashboard-instance';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface SingletonsBindMap {
    appState: {
      saving: boolean
    };
  }
}

export const appState = singletons.add('appState', { saving: false });

export const dashboards = collections.add('dashboards');

export const library = collections.add('library');

export const commands = new BatchCommands();

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
      })
      .finally(() => {
        appState.current.saving = false;
        appState.notify();
      });
  });

async function syncConfig () {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (typeof window === 'undefined') {
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

syncConfig().catch(console.error);
