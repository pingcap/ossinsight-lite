'use client';
import { State } from '@/store/store';
import { LibraryItem } from '@/utils/types/config';
import { shallowEqual, useSelector } from 'react-redux';
import Item from './Item';

function Section ({ name }: { name: string }) {
  const items = useSelector<State, LibraryItem[]>(({ library, widgets }) => {
    return Object.values(library.items).filter(item => {
      return widgets.resolved[item.name]?.category === name;
    });
  }, shallowEqual);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Item key={item.id ?? item.name} item={item} />
      ))}
      {items.length === 0 && (
        <li className="text-gray-400 text-xl">No widgets</li>
      )}
    </ul>
  );
}

export default Section;