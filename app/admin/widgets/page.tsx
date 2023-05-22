import { getWidgets } from '@/app/admin/widgets/op';
import { sortedEntries } from '@/src/utils/collection';
import React, { Suspense } from 'react';
import { addLibraryItemAction } from '@/app/admin/widgets/actions';
import dynamic from 'next/dynamic';

const Section = dynamic(() => import('@/src/_pages/List/Section'), { ssr: false });

export default async function Page () {
  const widgets = await getWidgets();

  return (
    <div className="container m-auto py-4">
      <h1 className="text-xl">Widgets list</h1>
      {sortedEntries(widgets).map(([name, items]) => (
        <section key={name} className="mt-8">
          <h2 className="text-lg">{name}</h2>
          <Suspense>
            <Section name={name} items={items} onAdd={addLibraryItemAction} />
          </Suspense>
        </section>
      ))}
    </div>
  );
}
