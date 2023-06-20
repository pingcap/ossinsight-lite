import { getAllDashboards, getLibrary } from '@/app/(client)/api/layout/operations';
import { getDatabaseUri, withConnection } from '@/utils/mysql';
import { isReadonly } from '@/utils/server/auth';
import { LayoutConfigV1 } from '@/utils/types/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest) {
  const readonly = isReadonly(req);
  const library = await getLibrary(readonly);
  const dashboard = await getAllDashboards(readonly);

  const res = await withConnection(getDatabaseUri(process.env.GITHUB_PERSONAL_DATABASE ?? 'github_personal'), ({ sql }) => {
    return sql.unique<{ login: string }>`
        SELECT login
        FROM curr_user
    `;
  });

  const name = res?.login ?? 'unknown';
  const date = new Date();

  const pad = (n: number, s: number = 2) => {
    return n.toString().padStart(s, '0');
  };

  const Y = pad(date.getUTCFullYear(), 4);
  const M = pad(date.getUTCMonth() + 1);
  const D = pad(date.getUTCDate());
  const h = pad(date.getUTCHours());
  const m = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());

  const dateStr = `${Y}${M}${D}${h}${m}${s}`;

  const config: LayoutConfigV1 = {
    version: 2,
    library,
    dashboard,
  };

  return NextResponse.json(config, {
    headers: {
      'Content-Disposition': `attachment; filename=${encodeURIComponent(name)}.${dateStr}.template.json`,
    },
  });
}

export const dynamic = 'force-dynamic';
