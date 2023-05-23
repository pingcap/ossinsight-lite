'use client';
import EditWidgetInstance from '@/src/_pages/EditWidgetInstance';
import { useParams } from 'next/navigation';
import { library } from '@/app/bind';
import { useCallback } from 'react';
import { useWatchItemFields } from '@/packages/ui/hooks/bind/hooks';

export default function Page () {
  const id = decodeURIComponent(useParams()!.id as string);
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
