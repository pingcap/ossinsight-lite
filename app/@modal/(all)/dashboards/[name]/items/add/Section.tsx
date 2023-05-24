'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import { dashboards } from '@/app/bind';
import { widgets } from '@/app/bind-client';
import { readItem } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { LibraryItem } from '@/src/types/config';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Suspense, useContext } from 'react';

export default function Section ({ dashboardName, name, items }: { dashboardName: string, name: string, items: LibraryItem[] }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 text-xl text-gray-700">
        Widget Type: <b>{name}</b>
      </h3>
      <ul className="grid grid-cols-2 gap-4 p-4">
        {items.map(item => (
          <li
            key={item.id ?? item.name}
            className="h-[209px] flex border rounded justify-center items-center gap-2 bg-white shadow-none hover:shadow cursor-pointer transition-all"
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
  const Widget = widget.default;
  const router = useRouter();

  const { closeModal } = useContext(ModalContext);

  const handleAdd = useRefCallback(() => {
    const dashboard = dashboards.getNullable(dashboardName)?.current;
    if (dashboard) {
      const id = item.id ?? item.name;

      if (!dashboard.items.has(id)) {
        dashboard.items.add(id, {
          id,
          rect: widget.defaultRect ?? [0, 0, 8, 3],
        });
      }
    }

    closeModal();
  });

  return (
    <div className="w-full h-full" onClick={handleAdd}>
      <Widget {...item.props} className={clsx('pointer-events-none w-full h-full', item.props?.className)} />
    </div>
  );
}
