import React from 'react';
import Create from '@/src/_pages/Dashboards/Create';
import List from '@/src/_pages/Dashboards/List';
import { getAllDashboards } from '@/app/api/layout/operations';

export default async function () {
  const [store, dashboardsObject] = await getAllDashboards()
  const dashboards = Object.keys(dashboardsObject);

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
