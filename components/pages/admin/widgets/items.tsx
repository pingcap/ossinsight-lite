'use client';
import Section from '@/components/pages/List/Section';
import { useInitialLoadLibraryItems } from '@/store/features/library';
import { State } from '@/store/store';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import { Suspense } from 'react';
import { shallowEqual, useSelector, useStore } from 'react-redux';

function Items ({ items: serverItems }: { items: LibraryItem[] }) {
  useInitialLoadLibraryItems(useStore(), serverItems, true);

  const categories = useSelector<State, string[]>(({ library, widgets }) => {
    const categories = new Set(Object.values(library.items).map(item => widgets.resolved[item.name]?.category).filter(Boolean));
    return [...categories].sort();
  }, shallowEqual);

  return (
    <>
      {categories.map((name) => (
        <section key={name} className="mt-8">
          <h2 className="text-lg">{name}</h2>
          <Suspense>
            <Section name={name} />
          </Suspense>
        </section>
      ))}
    </>
  );
}

export default clientOnly(Items);
