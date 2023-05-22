import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import { ADMIN_DATABASE_NAME } from '@/src/auth';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';

export async function getDashboards () {
  return await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql }) => (
    sql<{ name: string }>`
        SELECT name
        FROM dashboards;
    `
  ));
}

export async function addDashboard (name: string) {
  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql }) => (
    sql`
        INSERT INTO dashboards (name, properties)
        VALUES (${name}, ${JSON.stringify({ layout: defaultLayoutConfig })})
    `
  ));
}

export async function deleteDashboard (name: string) {
  if (name === 'default') {
    throw new Error(`Do not delete dashboard ${name}`);
  }

  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql }) => (
    sql`
        DELETE
        FROM dashboards
        WHERE name = ${name}
    `
  ));
}
