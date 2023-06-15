import DashboardList from '@/components/pages/admin/dashboards/DashboardList';
import { sql } from '@/utils/mysql';

export default async function () {
  const dashboards = await sql<{ name: string, properties: any, visibility: 'public' | 'private', items_count: number }>`
      SELECT name, d.properties AS properties, visibility, COUNT(di.item_id) AS items_count
      FROM dashboards d
               LEFT JOIN dashboard_items di ON d.name = di.dashboard_name
      GROUP BY 1
  `;

  return (
    <div>
      <h2>Dashboards</h2>
      <DashboardList dashboards={dashboards} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
