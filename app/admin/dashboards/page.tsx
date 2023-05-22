import { getDashboards } from '@/app/admin/dashboards/op';
import { AddDashboardForm, DeleteDashboardButton } from '@/app/admin/dashboards/actions-ui';

export default async function () {
  const dashboards = await getDashboards();

  return (
    <div>
      <table className="data-table">
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
              {item.name !== 'default' && <DeleteDashboardButton name={item.name} />}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <AddDashboardForm />
    </div>
  );
}