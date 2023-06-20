'use server';
import { getDatabaseUri, sql, withConnection } from '@/utils/mysql';
import { ADMIN_DATABASE_NAME } from '@/utils/server/auth';
import { LayoutConfigV1, LibraryItem } from '@/utils/types/config';
import { revalidatePath } from 'next/cache';

export async function addLibraryItemAction (item: LibraryItem) {
  await addLibraryItem(item);

  revalidatePath('/admin/widgets');
}

export async function addLibraryItem (item: LibraryItem) {
  await sql`
      INSERT INTO library_items (id, widget_name, properties)
      VALUES (${item.id}, ${item.name}, ${JSON.stringify(item.props)})
  `;
}

export async function uploadLayoutJsonAction (formData: FormData) {
  const config: LayoutConfigV1 = JSON.parse(await (formData.get('template.json') as File).text());

  if (config.version === 1) {
    Object.values(config.dashboard).forEach(dashboard => {
      dashboard.items.forEach(item => {
        const rect = (item as any).rect;
        delete (item as any).rect;
        item.layout = {
          lg: {
            x: rect[0] + 20,
            y: rect[1] + 8,
            w: rect[2],
            h: rect[3],
          },
        };
      });
    });
    config.version = 2;
  }

  if (config.version !== 2) {
    throw new Error(`Unsupported template.json version ${config.version}`);
  }

  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql, beginTransaction }) => {
    await beginTransaction();
    for (const { id, name, props } of config.library) {
      const propsString = JSON.stringify(props ?? {});
      console.log(`import library item ${id ?? name}`);
      await sql`
          INSERT INTO library_items (id, widget_name, properties)
          VALUES (${id ?? name}, ${name}, ${propsString})
          ON DUPLICATE KEY UPDATE widget_name = ${name},
                                  properties  = ${propsString};
      `;
    }
    for (const [name, { items, ...rest }] of Object.entries(config.dashboard)) {
      console.log(`import dashboard ${name}`);
      const confString = JSON.stringify(rest);
      await sql`
          INSERT INTO dashboards(name, properties)
          VALUES (${name}, ${confString})
          ON DUPLICATE KEY UPDATE properties = ${confString}
      `;

      await sql`
          DELETE
          FROM dashboard_items
          WHERE dashboard_name = ${name}
      `;

      for (const { id, ...rest } of items) {
        const restJson = JSON.stringify(rest);
        console.log(`import dashboard item ${id}`);

        await sql`
            INSERT INTO dashboard_items (dashboard_name, item_id, properties)
            VALUES (${name}, ${id}, ${restJson})
        `;
      }
    }
  });
}

export async function addDashboardAction (formData: FormData) {
  const name = formData.get('name');
  if (typeof name !== 'string') {
    throw new Error('name is required');
  }

  await addDashboard(name);
  revalidatePath('/admin/dashboards');
}

export async function deleteDashboardAction (name: string) {
  if (typeof name !== 'string') {
    throw new Error('name is required');
  }

  await deleteDashboard(name);
  revalidatePath('/admin/dashboards');
}

export async function toggleDashboardVisibilityAction (name: string, visibility: string) {
  let newVisibility = visibility === 'public' ? 'private' : 'public';

  if (typeof name !== 'string') {
    throw new Error('name is required');
  }

  await updateDashboardVisibility(name, newVisibility);
  revalidatePath('/admin/dashboards');
}

export async function addDashboard (name: string) {
  await sql`
      INSERT INTO dashboards (name, properties)
      VALUES (${name}, ${JSON.stringify({ layout: { size: [40, 16], gap: 8 } })})
  `;
}

export async function deleteDashboard (name: string) {
  if (name === 'default') {
    throw new Error(`Do not delete dashboard ${name}`);
  }

  await sql`
      DELETE
      FROM dashboards
      WHERE name = ${name}
  `;
}

export async function updateDashboardVisibility (name: string, visibility: string) {
  if (name === 'default') {
    throw new Error(`Default dashboard must bu public.`);
  }
  await sql`
      UPDATE dashboards
      SET visibility = ${visibility}
      WHERE name = ${name}
  `;
}
