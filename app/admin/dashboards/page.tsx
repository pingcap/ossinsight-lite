import { AddDashboardForm, DeleteDashboardButton } from '@/components/pages/admin/dashboards/forms';
import { sql } from '@/utils/mysql';
import Link from 'next/link';

export default async function () {
  const dashboards = await sql<{ name: string, properties: any, visibility: 'public' | 'private' }>`
      SELECT name, properties, visibility
      FROM dashboards
  `;

  return (
    <div>
      <table className="data-table table-auto">
        <thead>
        <tr>
          <th>Dashboard name</th>
          <td></td>
        </tr>
        </thead>
        <tbody>
        {dashboards.map(item => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>
              <div className="flex gap-2 items-center">
                <Link href={item.name === 'default' ? `/` : `/dashboards/${item.name}`}>Visit</Link>
                <Link href={`/dashboards/${item.name}/edit`}>Edit</Link>
                {item.name !== 'default' && <DeleteDashboardButton name={item.name} />}
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <AddDashboardForm />
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
