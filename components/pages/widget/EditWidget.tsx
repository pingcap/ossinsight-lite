'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import EditWidgetInstance from '@/components/EditWidgetInstance';
import { useInitialLoadLibraryItems, useLibraryItemField, useUpdateLibraryItem } from '@/store/features/library';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import { useCallback, useContext } from 'react';
import { useStore } from 'react-redux';

export interface EditWidgetProps {
  id: string;
  item?: LibraryItem;
}

function EditWidget ({ id, item }: EditWidgetProps) {
  useInitialLoadLibraryItems(useStore(), item ? [item] : []);
  const { name, props: { showBorder, ...props } } = useLibraryItemField(id, ({ name, props }) => ({ name, props }));
  const updateLibraryItem = useUpdateLibraryItem();
  const { useCompactMode } = useContext(ModalContext);
  useCompactMode(!name.startsWith('db/sql'));

  return (
    <EditWidgetInstance
      name={name}
      props={props}
      onPropsChange={useCallback((key, value) => {
        updateLibraryItem(id, (item, ctx) => {
          if (item.props[key] !== value) {
            item.props = { ...item.props, [key]: value };
            ctx.changedKeys = [`props:${key}`];
          } else {
            ctx.changed = false;
          }
          return item;
        });
      }, [id])}
    />
  );
}

export default clientOnly(EditWidget);
