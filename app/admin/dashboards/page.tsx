import { AddDashboardForm, ChangeVisibleButton, DeleteDashboardButton } from '@/components/pages/admin/dashboards/forms';
import { sql } from '@/utils/mysql';
import BoxArrowUpRightIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg';
import PencilIcon from 'bootstrap-icons/icons/pencil.svg';
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
              <div className="flex gap-1 items-center">
                <Link className="btn btn-link" href={item.name === 'default' ? `/` : `/dashboards/${item.name}`} prefetch={false}>
                  <BoxArrowUpRightIcon width={12} height={12} />
                </Link>
                <Link className="btn btn-link" href={`/dashboards/${item.name}/edit`} prefetch={false}>
                  <PencilIcon width={12} height={12} />
                </Link>

                {item.name !== 'default' && (
                  <>
                    <ChangeVisibleButton name={item.name} visibility={item.visibility} />
                    <DeleteDashboardButton name={item.name} />
                  </>
                )}
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
