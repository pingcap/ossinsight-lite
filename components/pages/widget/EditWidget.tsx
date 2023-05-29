'use client'
import EditWidgetInstance from '@/components/EditWidgetInstance';
import { library } from '@/core/bind';
import { useWatchItemFields } from '@/packages/ui/hooks/bind';
import clientOnly from '@/utils/clientOnly';
import { useCallback } from 'react';

export interface EditWidgetProps {
  id: string;
}

function EditWidget ({ id }: EditWidgetProps) {
  const { name, props } = useWatchItemFields('library', id, ['name', 'props']);

  return (
    <EditWidgetInstance
      name={name}
      props={props}
      onPropsChange={useCallback((key, value) => {
        library.update(id, (item, ctx) => {
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

export default clientOnly(EditWidget)
