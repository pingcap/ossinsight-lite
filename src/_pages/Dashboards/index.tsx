import React from 'react';
import Create from '@/src/_pages/Dashboards/Create';
import List from '@/src/_pages/Dashboards/List';

export default function () {
  return (
    <div className="container m-auto p-4">
      <ul>
        <List />
        <li>
          <Create />
        </li>
      </ul>
    </div>
  );
}
