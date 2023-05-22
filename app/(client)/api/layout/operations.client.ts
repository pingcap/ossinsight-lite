import { Command } from '@/src/core/commands';
import { Dashboard, ItemReference, LibraryItem, Store } from '@/src/types/config';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';

export async function commit (commands: Command[]) {
  const store: Partial<Record<Store, boolean>> = {};
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commands),
      });
      if (res.ok) {
        store.kv = (await res.json()).kv;
      }
    } catch {
      store.kv = false;
    }
  }

  if (typeof localStorage !== 'undefined') {
    let localDashboardsString = localStorage.getItem('widgets:dashboards');
    let localLibraryString = localStorage.getItem('widgets:library');

    let dashboards: Record<string, Dashboard> = {};
    let library: Record<string, LibraryItem> = {};

    if (localDashboardsString) {
      dashboards = JSON.parse(localDashboardsString);
    } else {
      dashboards = {};
    }

    if (localLibraryString) {
      library = JSON.parse(localLibraryString);
    } else {
      library = {};
    }

    let items: ItemReference[];
    let idx: number;

    for (let command of commands) {
      switch (command.type) {
        case 'update-library-item':
          library[command.id] = command.payload;
          break;
        case 'update-dashboard-item':
          items = (dashboards[command.dashboard] ||= { layout: defaultLayoutConfig, items: [] }).items;
          idx = items.findIndex(item => item.id === command.id);
          if (idx !== -1) {
            items.splice(idx, 1, command.payload);
          } else {
            items.push(command.payload);
          }
          break;
        case 'delete-library-item':
          delete library[command.id];
          break;
        case 'delete-dashboard-item':
          items = (dashboards[command.dashboard] ||= { layout: defaultLayoutConfig, items: [] }).items;
          idx = items.findIndex(item => item.id === command.id);
          if (idx !== -1) {
            items.splice(idx, 1);
          }
      }
    }

    localDashboardsString = JSON.stringify(dashboards);
    localLibraryString = JSON.stringify(Object.values(library));

    localStorage.setItem('widgets:dashboards', localDashboardsString);
    localStorage.setItem('widgets:library', localLibraryString);
  }

  store.localStorage = true;

  return store;
}
