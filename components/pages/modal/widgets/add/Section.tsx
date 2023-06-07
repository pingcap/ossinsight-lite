'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import WidgetPreview from '@/components/WidgetPreview';
import { dashboards, library } from '@/core/bind';
import { widgets } from '@/core/bind-client';
import { readItem } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { LibraryItem } from '@/utils/types/config';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { Suspense, useContext } from 'react';

export default function Section ({ dashboardName, name, items }: { dashboardName: string, name: string, items: LibraryItem[] }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 text-xl text-gray-700">
        <b>{name}</b>
      </h3>
      <ul className="grid grid-cols-2 gap-4 p-4">
        {items.map(item => (
          <li
            key={item.id ?? item.name}
            className="h-[239px] flex flex-col justify-stretch border shadow-none hover:shadow cursor-pointer transition-all overflow-hidden"
          >
            <Suspense fallback={<><LoadingIndicator />Widget loading</>}>
              <Item item={item} dashboardName={dashboardName} />
            </Suspense>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Item ({ item, dashboardName }: { dashboardName: string, item: LibraryItem }) {
  const widget = readItem(widgets, item.name).current;
  const { closeModal } = useContext(ModalContext);

  const handleAdd = useRefCallback(() => {
    const dashboard = dashboards.getNullable(dashboardName)?.current;
    if (dashboard) {
      const id = item.id ?? item.name;

      if (!library.has(id)) {
        library.inactiveScope(() => {
          library.add(id, item);
        })
      }

      if (!dashboard.items.has(id)) {
        dashboard.items.add(id, {
          id,
          layout: {
            xl: {
              x: 0,
              y: 0,
              w: 4,
              h: 2
            }
          }
        });
      }
    }

    closeModal();
  });

  return (
    <WidgetPreview {...item} className="font-sketch" onClick={handleAdd} />
  );
}
