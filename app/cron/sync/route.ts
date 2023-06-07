import { importLayoutConfig } from '@/actions/widgets';
import { sql } from '@/utils/mysql';
import { NextResponse } from 'next/server';

export async function POST () {
  const dashboard = await sql.unique<{ name: string, upstream: string }>`
      SELECT JSON_EXTRACT(properties, '$.upstream') AS upstream, name
      FROM dashboards
      WHERE JSON_LENGTH(properties, '$.upstream') = 1
        AND FROM_UNIXTIME(IFNULL(JSON_EXTRACT(properties, '$.lastSyncedAt') / 1000, 0)) < DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      LIMIT 1
  `;

  if (dashboard == null) {
    return NextResponse.json({ message: 'Empty sync list (or all dashboards recently updated)' });
  }

  console.log('importing', dashboard);

  const res = await fetch(dashboard.upstream);

  if (!res.ok) {
    return NextResponse.json({
      message: `Failed to fetch ${dashboard.upstream}`,
    }, { status: 400 });
  }

  const config = await res.json();
  if (!config.dashboard) {
    return NextResponse.json({
      message: `Bad response data`,
    }, { status: 400 });
  }

  const dashboards = Object.keys(config.dashboard);
  if (dashboards.length !== 1) {
    return NextResponse.json({
      message: `Bad response data, ${dashboards.length} dashboards returned.`,
    }, { status: 400 });
  }

  const name = dashboards[0];
  const remoteDashboardConfig = config.dashboard[name];
  delete config.dashboard[name];
  config.dashboard[dashboard.name] = remoteDashboardConfig;
  delete remoteDashboardConfig.upstream;
  delete remoteDashboardConfig.lastSyncedAt;

  await importLayoutConfig(config);

  await sql`
      UPDATE dashboards
      SET properties = JSON_SET(properties, '$.lastSyncedAt', UNIX_TIMESTAMP() * 1000)
      WHERE name = ${dashboard.name}
  `;

  return NextResponse.json({ message: `Synced ${dashboard.name} from ${dashboard.upstream}` });
}