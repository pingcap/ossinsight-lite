'use client';
import Section from '@/components/pages/modal/widgets/add/Section';
import { useDashboardItems } from '@/store/features/dashboards';
import { LibraryItem } from '@/utils/types/config';
import { groupItemsByCategory } from '@/utils/widgets';
import { cache, use, useMemo } from 'react';

export default function Sections ({ dashboardName, items }: { dashboardName: string, items: LibraryItem[] }) {
  const dashboardItems = useDashboardItems();
  items = useMemo(() => {
    const map = Object.values(dashboardItems).reduce((set, item) => set.add(item.id), new Set<string>());
    return items.filter(item => {
      if (item.id) {
        return !map.has(item.id);
      } else {
        return !map.has(item.name);
      }
    });
  }, [items, dashboardName]);

  const map = groupItemsByCategory(items);

  return (
    <>
      {Object.entries(map).map(([name, items]) => (
        <Section key={name} name={name} items={items} />
      ))}
    </>
  );
}