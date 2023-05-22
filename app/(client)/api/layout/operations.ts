import kv from '@/app/(client)/api/kv';
import { Dashboard as DashboardConfig, Dashboard, ItemReference, LibraryItem, Store } from '@/src/types/config';
import layout from '@ossinsight-lite/widgets/layout.json';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';

export async function getDashboard (name: string) {
  let store: Store | undefined;
  let resolved: Dashboard | undefined | null;
  try {
    const [exists, items] = await kv.multi()
      .exists(`dashboard:${name}`)
      .hgetall(`dashboard:${name}`)
      .exec<[number, Record<string, ItemReference>]>();
    if (exists) {
      resolved = {
        layout: defaultLayoutConfig,
        items: Object.values(items),
      };
      store = 'kv';
    }
  } catch {
  }

  if (!resolved) {
    if (typeof localStorage !== 'undefined') {
      const dashboards = localStorage.getItem('widgets:dashboards');
      if (dashboards) {
        resolved = JSON.parse(dashboards)[name.replace(/^dashboard:/, '')] as Dashboard;
        if (resolved) {
          store = 'localStorage';
        }
      }
    }
  }
  if (!resolved) {
    resolved = layout.dashboard[name as never] as Dashboard;
    if (resolved) {
      try {
        const items = resolved.items.reduce((all, item) => {
          all[item.id] = item;
          return all;
        }, {} as Record<string, ItemReference>);
        await kv.hset(`dashboard:${name}`, items);
      } catch {
      }
      store = 'new';
    }
  }
  if (!resolved) {
    resolved = defaultDashboard();
    store = 'new';
  }
  return [store!, resolved] as const;
}

export async function getAllDashboardNames () {
  let store: Store | undefined;
  let resolved: string[] | undefined | null;

  try {
    resolved = await kv.keys('dashboard:*');
    if (resolved.length > 0) {
      resolved = resolved.map(name => name.replace(/^dashboard:/, ''))
      store = 'kv';
    }
  } catch {
  }

  if (!resolved) {
    if (typeof localStorage !== 'undefined') {
      const dashboards = localStorage.getItem('widgets:dashboards');
      if (dashboards) {
        resolved = Object.keys(JSON.parse(dashboards));
        store = 'localStorage';
      }
    }
  }
  if (!resolved) {
    resolved = Object.keys(layout.dashboard);
    store = 'new';
  }
  return [store!, resolved] as const;
}

export async function getAllDashboards () {
  let store: Store | undefined;
  let resolved: Record<string, Dashboard> | undefined | null;
  try {
    const dashboardKeys = await kv.keys('dashboard:*');
    if (dashboardKeys.length > 0) {
      const itemLists = await dashboardKeys.reduce((pipeline, name) => {
        return pipeline.hgetall(name);
      }, kv.multi()).exec<Record<string, ItemReference>[]>();

      resolved = dashboardKeys.reduce((all, name, index) => {
        all[name.replace(/^dashboard:/, '')] = {
          layout: defaultLayoutConfig,
          items: Object.values(itemLists[index]),
        };
        return all;
      }, {} as Record<string, Dashboard>);
      store = 'kv';
    }
  } catch (e) {
  }

  if (!resolved) {
    if (typeof localStorage !== 'undefined') {
      const dashboards = localStorage.getItem('widgets:dashboards');
      if (dashboards) {
        resolved = JSON.parse(dashboards) as Record<string, Dashboard>;
        store = 'localStorage';
      }
    }
  }
  if (!resolved) {
    resolved = layout.dashboard as never as Record<string, Dashboard>;
    store = 'new';
    try {
      await Object.entries(layout.dashboard as never as Record<string, Dashboard>).reduce((pipeline, [name, dashboard]) => {
        return pipeline.hset(`dashboard:${name}`, dashboard.items.reduce((all, item) => {
          all[item.id] = item;
          return all;
        }, {} as Record<string, ItemReference>));
      }, kv.pipeline()).exec();
    } catch {
    }
  }
  return [store!, resolved] as const;
}

export async function getLibrary () {
  let resolved: LibraryItem[] | undefined | null;
  let store: Store | undefined;
  try {
    const all = await kv.hgetall<Record<string, LibraryItem>>('library');
    if (all) {
      resolved = [...Object.values(all)];
      store = 'kv';
    }
  } catch {
  }

  if (!resolved) {
    if (typeof localStorage !== 'undefined') {
      const library = localStorage.getItem('widgets:library');
      if (library) {
        resolved = JSON.parse(library);
        store = 'localStorage';
      }
    }
  }

  if (!resolved) {
    resolved = layout.library as LibraryItem[];
    store = 'new';
  }

  return [store!, resolved] as const;
}

const defaultDashboard = (): DashboardConfig => {
  return {
    layout: { ...defaultLayoutConfig },
    items: [],
  };
};
