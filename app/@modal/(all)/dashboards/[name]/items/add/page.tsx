'use client';
import { dashboards, library } from '@/app/bind';
import { widgets } from '@/app/bind-client';
import { LibraryItem } from '@/src/types/config';
import { ResolvedWidgetModule } from '@/src/widgets-manifest';
import { useMemo } from 'react';
import Section from './Section';

export default async function Page ({ params }: any) {
  const dashboardName = decodeURIComponent(params.name);

  const dashboard = dashboards.getNullable(dashboardName)?.current;

  const items = useMemo(() => {
    return library.values.filter(item => {
      if (!dashboard) {
        return false;
      }
      return !dashboard.items.has(item.id ?? item.name);
    });
  }, []);

  const names = Array.from(new Set(items.map(item => item.name)));
  const resolvedWidgets = (await Promise.all(names.map(name => widgets.get(name)))).map(w => w.current);

  const widgetsMap: Record<string, ResolvedWidgetModule> = {};
  for (let i = 0; i < names.length; i++) {
    widgetsMap[names[i]] = resolvedWidgets[i];
  }

  const map = items.reduce((map, item) => {
    const category = widgetsMap[item.name]!.category;
    map[category] ||= [];
    map[category].push(item);
    return map;
  }, {} as Record<string, LibraryItem[]>);

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
