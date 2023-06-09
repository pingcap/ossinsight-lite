'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import WidgetPreview from '@/components/WidgetPreview';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useAddDashboardItem } from '@/store/features/dashboards';
import { useAddLibraryItem } from '@/store/features/library';
import { LibraryItem } from '@/utils/types/config';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { Suspense, useContext } from 'react';

export default function Section ({ name, items }: { name: string, items: LibraryItem[] }) {
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
              <Item item={item} />
            </Suspense>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Item ({ item }: { item: LibraryItem }) {
  const { closeModal } = useContext(ModalContext);
  const addLibraryItem = useAddLibraryItem();
  const addDashboardItem = useAddDashboardItem();

  const handleAdd = useRefCallback(() => {
    const id = item.id ?? item.name;

    addLibraryItem(item);

    addDashboardItem({
      id,
      layout: {
        lg: {
          x: 0,
          y: 0,
          w: 4,
          h: 2,
        },
      },
    });

    closeModal();
  });

  return (
    <WidgetPreview {...item} className="font-sketch" onClick={handleAdd} />
  );
}
