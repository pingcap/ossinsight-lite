'use client';
import { LibraryItem } from '@/utils/types/config';
import Item from './Item';

function Section ({ name, items, onAdd }: { name: string, items: LibraryItem[], onAdd: (item: LibraryItem) => Promise<any> }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Item key={item.id ?? item.name} item={item} />
      ))}
      {items.length === 0 && (
        <li className="text-gray-400 text-xl">No widgets</li>
      )}
      {/*<Suspense>*/}
      {/*  <Add name={name} onAdd={onAdd} />*/}
      {/*</Suspense>*/}
    </ul>
  );
}

export default Section;