'use server';

import { ADMIN_DATABASE_NAME } from '@/utils/common';
import { getDatabaseUri, withConnection } from '@/utils/mysql';
import { revalidatePath } from 'next/cache';

export async function updateDashboardName (name: string, newName: string) {
  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql, beginTransaction, commit }) => {
    await beginTransaction();

    await sql`
        INSERT INTO dashboards (name, properties, visibility)
        SELECT ${newName}, properties, visibility
        FROM dashboards
        WHERE name = ${name}
    `;

    await sql`
        UPDATE dashboard_items
        SET dashboard_name = ${newName}
        WHERE dashboard_name = ${name}
    `;

    await sql`
        DELETE
        FROM dashboards
        WHERE name = ${name}
    `;
  });

  revalidatePath('/admin/dashboards');
}
