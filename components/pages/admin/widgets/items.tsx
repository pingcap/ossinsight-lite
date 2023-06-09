'use client';
import { addLibraryItemAction } from '@/actions/widgets';
import Section from '@/components/pages/List/Section';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import { groupItemsByCategory } from '@/utils/widgets';
import { Suspense, use } from 'react';

function Items ({ items }: { items: LibraryItem[] }) {
  const groups = groupItemsByCategory(items);

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
