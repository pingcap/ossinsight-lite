'use client';
import { library } from '@/core/bind';
import EditWidgetInstance from '@/components/EditWidgetInstance';
import { useWatchItemFields } from '@/packages/ui/hooks/bind/hooks';
import { useCallback } from 'react';

export default function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);
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
