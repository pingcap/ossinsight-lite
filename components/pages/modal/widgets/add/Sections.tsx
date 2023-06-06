'use client';
import Section from '@/components/pages/modal/widgets/add/Section';
import { dashboards } from '@/core/bind';
import { readItem } from '@/packages/ui/hooks/bind';
import { LibraryItem } from '@/utils/types/config';
import { groupItemsByCategory } from '@/utils/widgets';
import { cache, use, useMemo } from 'react';

export default function Sections ({ dashboardName, items }: { dashboardName: string, items: LibraryItem[] }) {
  const dashboard = readItem(dashboards, dashboardName);
  items = useMemo(() => {
    const map = dashboard.current.items.values.reduce((set, item) => set.add(item.id), new Set<string>());
    return items.filter(item => {
      if (item.id) {
        return !map.has(item.id);
      } else {
        return !map.has(item.name);
      }
    });
  }, [items, dashboardName]);

  const map = use(cache(groupItemsByCategory)(items));

  return (
    <>
      {Object.entries(map).map(([name, items]) => (
        <Section key={name} dashboardName={dashboardName} name={name} items={items} />
      ))}
    </>
  );
}