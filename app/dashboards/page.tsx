import Create from '@/src/_pages/Dashboards/Create';
import List from '@/src/_pages/Dashboards/List';
import { serverDashboardNames } from '@/app/api/layout/operations.server';

export default async function () {
  const [_, dashboards] = await serverDashboardNames();

  return (
    <div className="container m-auto p-4">
      <ul>
        <List dashboards={dashboards} />
        <li>
          <Create />
        </li>
      </ul>
    </div>
  );
}
