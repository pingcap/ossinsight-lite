import { Dashboard as DashboardConfig, Dashboard, ItemReference, LibraryItem, Store } from '@/src/types/config';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';
import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import { ADMIN_DATABASE_NAME } from '@/src/auth';

const uri = getDatabaseUri(ADMIN_DATABASE_NAME);

export async function getDashboard (name: string) {
  let store: Store | undefined;
  let resolved: Dashboard | undefined | null;
  try {
    const dashboard = await withConnection(uri, async ({ sql }) => {

      let dashboard: Dashboard = { layout: defaultLayoutConfig, items: [] };
      const res = await sql<{ name: string }>`
          SELECT properties
          FROM dashboards
          WHERE name = ${name}
          LIMIT 1;
      `;
      if (!res[0]) {
        return;
      }
      dashboard.layout = res[0].properties.layout;
      const rows = await sql<{ item_id: string, properties: any }>`
          SELECT item_id, properties
          FROM dashboard_items
          WHERE dashboard_name = ${name};`;
      dashboard.items = rows.map(row => {
        return {
          id: row.item_id,
          ...row.properties,
        };
      });

      return dashboard;
    });

    if (dashboard) {
      resolved = dashboard;
      store = 'tidb';
    }
  } catch (e) {
    console.error(e);
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
    throw new Error(`Dashboard ${name} not found`);
  }
  return [store!, resolved] as const;
}

export async function getAllDashboardNames () {
  let store: Store | undefined;
  let resolved: string[] | undefined | null;

  try {
    const res = await withConnection(uri, ({ sql }) => {
      return sql<{ name: string }>`
          SELECT name
          FROM dashboards;
      `;
    });
    resolved = res.map(item => item.name);
    store = 'tidb';
  } catch (e) {
    console.error(e);
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
    throw new Error('No config found')
  }

  return [store!, resolved] as const;
}

export async function getAllDashboards () {
  let store: Store | undefined;
  let resolved: Record<string, Dashboard> | undefined | null;
  try {
    resolved = await withConnection(uri, async ({ sql }) => {
      const items = await sql<{ dashboard_name: string, item_id: string, properties: any }>`
          SELECT dashboard_name, item_id, properties
          FROM dashboard_items;
      `;

      const parsedItems = items.reduce((map, item) => {
        let items = map[item.dashboard_name];
        if (!items) {
          map[item.dashboard_name] = items = [];
        }
        items.push({
          id: item.item_id,
          ...item.properties,
        });
        return map;
      }, {} as Record<string, ItemReference[]>);

      const dashboards = await sql<{ name: string, properties: any }>`
          SELECT name, properties
          FROM dashboards;
      `;

      return dashboards.reduce((dashboards, dashboard) => {
        dashboards[dashboard.name] = {
          ...dashboard.properties,
          items: parsedItems[dashboard.name] ?? [],
        };
        return dashboards;
      }, {} as Record<string, Dashboard>);
    });
    store = 'tidb';
  } catch (e) {
    console.error(e);
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
    throw new Error('No config found');
  }
  return [store!, resolved] as const;
}

export async function getLibrary () {
  let resolved: LibraryItem[] | undefined | null;
  let store: Store | undefined;
  try {
    resolved = await withConnection(uri, async ({ sql }) => {
      const rows = await sql<{ id: string, widget_name: string, properties: object }>`
          SELECT id, widget_name, properties
          FROM library_items
      `;
      return rows.map(item => {
        return {
          id: item.id,
          name: item.widget_name,
          props: item.properties,
        };
      });
    });
    store = 'tidb';
  } catch (e) {
    console.error(e);
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
    throw new Error('No library found');
  }

  return [store!, resolved] as const;
}

const defaultDashboard = (): DashboardConfig => {
  return {
    layout: { ...defaultLayoutConfig },
    items: [],
  };
};
