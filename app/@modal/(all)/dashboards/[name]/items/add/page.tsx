'use client';
import { dashboards, library } from '@/app/bind';
import { groupBy } from '@/src/utils/collection';
import { useMemo } from 'react';
import Section from './Section';

export default async function Page ({ params }: any) {
  const dashboardName = decodeURIComponent(params.name);

  const dashboard = dashboards.getNullable(dashboardName)?.current

  const items = useMemo(() => {
    return library.values.filter(item => {
      if (!dashboard) {
        return false
      }
      return !dashboard.items.has(item.id ?? item.name)
    })
  }, [])

  // SQL request cached across navigations, see https://github.com/vercel/next.js/issues/42991
  //
  // const items = await sql<LibraryItem>`
  //     SELECT id, widget_name AS name, properties AS props
  //     FROM library_items
  //     WHERE id NOT IN (SELECT item_id
  //                      FROM dashboard_items
  //                      WHERE dashboard_name = ${dashboardName})
  // `;

  const map = groupBy(items, 'name');

  return (
    <div className="font-sketch">
      <h2 className="text-xl font-bold">Add widget</h2>
      {Object.entries(map).map(([name, items]) => (
        <Section key={name} dashboardName={dashboardName} name={name} items={items} />
      ))}
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
