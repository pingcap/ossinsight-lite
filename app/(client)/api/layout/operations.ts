import * as db from '@/app/(client)/api/layout/sql';
import { getLibraryItems, getPublicLibraryItems } from '@/app/(client)/api/layout/sql';
import { ADMIN_DATABASE_NAME } from '@/utils/common';
import { getDatabaseUri, sql, withConnection } from '@/utils/mysql';
import { Dashboard, ItemReference, LibraryItem } from '@/utils/types/config';
import { notFound, redirect } from 'next/navigation';

const uri = getDatabaseUri(ADMIN_DATABASE_NAME);

export async function getDashboard (name: string, readonly: boolean) {
  if (uri === '') {
    redirect('/status');
  }

  try {
    const res = await withConnection(uri, async ({ sql }) => {
      let dashboard: Dashboard;
      dashboard = { layout: { size: [40, 16], gap: 8 }, items: [] };
      const res = await (readonly ? db.getPublicDashboard : db.getDashboard)(sql, name);
      if (!res[0]) {
        return;
      }
      dashboard.layout = res[0].properties.layout;
      const rows = await (readonly ? db.getDashboardPublicLibraryItems : db.getDashboardLibraryItems)(sql, name);
      dashboard.items = rows.map(row => {
        return {
          id: row.item_id,
          ...row.properties,
        };
      });
      dashboard.visibility = res[0].visibility;

      return [dashboard, rows.map((item): LibraryItem => ({
        id: item.item_id,
        name: item.widget_name,
        props: item.item_properties,
        visibility: item.visibility,
      }))] as const;
    });
    if (res) {
      return res;
    }
  } catch (e) {
    console.error(e);
  }

  notFound();
}

export async function getAllDashboards (readonly: boolean) {
  try {
    return await withConnection(uri, async ({ sql }) => {
      const items = await (readonly ? db.getAllPublicDashboardItems : db.getAllDashboardItems)(sql);

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

      const dashboards = await (readonly ? db.getPublicDashboards : db.getDashboards)(sql);

      return dashboards.reduce((dashboards, dashboard) => {
        dashboards[dashboard.name] = {
          ...dashboard.properties,
          visibility: dashboard.visibility,
          items: parsedItems[dashboard.name] ?? [],
        };
        return dashboards;
      }, {} as Record<string, Dashboard>);
    });
  } catch (e) {
    console.error(e);
  }
  throw new Error('No config found');
}

export async function getLibraryItem (id: string) {
  try {
    const item = await db.getLibraryItem(sql, id);
    if (item) {
      const { id, properties, visibility, widget_name } = item;
      return { id, name: widget_name, props: properties, visibility } satisfies LibraryItem;
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getLibrary (readonly: boolean) {
  try {
    return await withConnection(uri, async ({ sql }) => {
      const rows = await (readonly ? getPublicLibraryItems : getLibraryItems)(sql);
      return rows.map(item => {
        return {
          id: item.id,
          name: item.widget_name,
          props: item.properties,
          visibility: item.visibility,
          referencedDashboards: item.dashboards,
        };
      });
    });
  } catch (e) {
    console.error(e);
  }

  throw new Error('No library found');
}

export async function getDashboardNames (readonly: boolean) {
  const dashboards = await (readonly ? db.getPublicDashboardNames : db.getDashboardNames)(sql);

  return dashboards.map(item => item.name);
}

export async function getDashboardAbsentLibraryItems (dashboard: string) {
  const data = await db.getDashboardAbsentLibraryItems(sql, dashboard);
  return data.map((item): LibraryItem => ({
    id: item.id,
    name: item.widget_name,
    props: item.properties,
    visibility: item.visibility,
  }));
}
