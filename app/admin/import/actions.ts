'use server';
import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import { ADMIN_DATABASE_NAME } from '@/src/auth';
import { LayoutConfigV1 } from '@/src/types/config';

export async function uploadLayoutJsonAction (formData: FormData) {
  const config: LayoutConfigV1 = JSON.parse(await (formData.get('layout.json') as File).text());

  if (config.version !== 1) {
    throw new Error('Only support layout.json version 1');
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