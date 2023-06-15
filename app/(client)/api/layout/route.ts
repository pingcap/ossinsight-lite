import { merge } from '@/core/commands';
import { getDatabaseUri, withConnection } from '@/utils/mysql';
import { ADMIN_DATABASE_NAME } from '@/utils/server/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST (req: NextRequest) {
  const commands = merge(await req.json());
  let success: boolean;

  try {
    await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql, beginTransaction }) => {
      await beginTransaction();

      for (let command of commands) {
        switch (command.type) {
          case 'update-library-item': {
            const { name, props, visibility } = command.payload;
            const propsString = JSON.stringify(props || {});

            await sql`
                INSERT INTO library_items (id, widget_name, properties, visibility)
                VALUES (${command.id}, ${name}, ${propsString}, ${visibility})
                ON DUPLICATE KEY UPDATE widget_name = ${name},
                                        properties  = ${propsString},
                                        visibility  = ${visibility}
            `;
            break;
          }
          case 'delete-library-item': {
            await sql`
                DELETE
                FROM library_items
                WHERE id = ${command.id}`;
            break;
          }
          case 'update-dashboard-item': {
            const { id, ...rest } = command.payload;

            const propsString = JSON.stringify(rest);

            await sql`
                INSERT INTO dashboard_items(dashboard_name, item_id, properties)
                VALUES (${command.dashboard}, ${command.id}, ${propsString})
                ON DUPLICATE KEY UPDATE properties = ${propsString}`;
            break;
          }
          case 'delete-dashboard-item': {
            await sql`
                DELETE
                FROM dashboard_items
                WHERE dashboard_name = ${command.dashboard}
                  AND item_id = ${command.id}
            `;
            break;
          }
        }
      }
    });
    success = true;
  } catch (e) {
    console.error(e);
    success = false;
  }

  return NextResponse.json({ tidb: success });
}
