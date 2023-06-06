import { sql } from '@/utils/mysql';
import { isReadonly } from '@/utils/server/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest) {

  const readonly = isReadonly(req);
  let playground = false;

  const username = process.env.TIDB_USER;
  if (username) {
    const readonlyUsername = username.replace(/\.[^.]*$/, '.osslreadonly');

    const found = await sql.unique`
        SELECT *
        FROM mysql.user
        WHERE user = ${readonlyUsername}
    `;

    if (found) {
      playground = true;
    }
  }

  return NextResponse.json({
    authenticated: !readonly,
    playground,
  });
}
