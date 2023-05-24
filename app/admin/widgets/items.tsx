'use client';
import { addLibraryItemAction } from '@/app/admin/widgets/actions';
import Section from '@/src/_pages/List/Section';
import { LibraryItem } from '@/src/types/config';
import clientOnly from '@/src/utils/clientOnly';
import { groupItemsByCategory } from '@/src/utils/widgets';
import { Suspense, use } from 'react';

function Items ({ items }: { items: LibraryItem[] }) {
  const groups = use(groupItemsByCategory(items));

  return (
    <>
      {Object.entries(groups).map(([name, items]) => (
        <section key={name} className="mt-8">
          <h2 className="text-lg">{name}</h2>
          <Suspense>
            <Section name={name} items={items} onAdd={addLibraryItemAction} />
          </Suspense>
        </section>
      ))}
    </>
  );
}

export default clientOnly(Items);
