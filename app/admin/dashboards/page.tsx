import { AddDashboardForm, DeleteDashboardButton } from '@/app/admin/dashboards/actions-ui';
import { getDashboards } from '@/app/admin/dashboards/op';
import { authenticateGuard } from '@/src/auth';
import Link from 'next/link';

export default async function () {
  await authenticateGuard('/admin/dashboards');
  const dashboards = await getDashboards();

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