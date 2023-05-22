import { NextRequest, NextResponse } from 'next/server';
import { merge } from '@/src/core/commands';
import { ADMIN_DATABASE_NAME, authenticateApiGuard } from '@/src/auth';
import { getDatabaseUri, withConnection } from '@/src/utils/mysql';

export async function POST (req: NextRequest) {
  const res = await authenticateApiGuard(req);
  if (res) {
    return res;
  }
  const commands = merge(await req.json());
  let success: boolean;

  try {
    await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql, beginTransaction }) => {
      await beginTransaction();

      for (let command of commands) {
        switch (command.type) {
          case 'update-library-item': {
            const { name, props } = command.payload;
            const propsString = JSON.stringify(props || {});

            await sql`
                INSERT INTO library_items (id, widget_name, properties)
                VALUES (${command.id}, ${name}, ${propsString})
                ON DUPLICATE KEY UPDATE widget_name = ${name},
                                        properties  = ${propsString}
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
  } catch {
    success = false;
  }

  return NextResponse.json({ tidb: success });
}
