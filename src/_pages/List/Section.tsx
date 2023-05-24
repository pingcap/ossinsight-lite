'use client';
import { widgets } from '@/app/bind-client';
import { readItem } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { WidgetContextProvider } from '@/src/components/WidgetContext';
import PlusIcon from '@/src/icons/plus.svg';
import { LibraryItem } from '@/src/types/config';
import { getConfigurable, getDuplicable } from '@/src/utils/widgets';
import clsx from 'clsx';
import Link from 'next/link';
import { Suspense, useTransition } from 'react';

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

function Item ({ item: { name, id, props } }: { item: LibraryItem }) {
  return (
    <li className="border border-gray bg-white rounded text-gray-700 flex flex-col gap-4 p-2" key={name}>
      <div className="h-[239px] flex flex-col justify-stretch overflow-hidden">
        <Suspense fallback={<div className="w-full h-full flex justify-center items-center gap-2"><LoadingIndicator /> Loading widget...</div>}>
          <Widget className="font-sketch" id={id} name={name} props={props} />
        </Suspense>
      </div>
    </li>
  );
}

function Add ({ name, onAdd }: { name: string, onAdd: (item: LibraryItem) => Promise<void> }) {
  const widget = readItem(widgets, name).current;
  let [isPending, startTransition] = useTransition();

  const handleAdd = useRefCallback(() => {
    startTransition(() => {
      const id = `${name}-${Math.round(Date.now())}`;
      void onAdd({
        id,
        name,
        props: widget.defaultProps,
      });
    });
  });

  if (getDuplicable(widget)) {
    return (
      <li className="border-4 border-dashed rounded text-gray-400 p-2 transition-colors hover:text-gray-700 hover:border-gray-500">
        <button className="flex w-full justify-center items-center h-[263px]" onClick={handleAdd}>
          <PlusIcon width={56} height={56} />
        </button>
      </li>
    );
  }

  return null;
}

function Widget ({ id, name, className, props }: { id: string | undefined, name: string, className: string, props: any }) {
  const widget = readItem(widgets, name).current;
  const Widget = widget.default;

  let el = <Widget {...props} {...widget.widgetListItemPropsOverwrite} className={clsx('flex-1', props.className, widget.widgetListItemPropsOverwrite?.className, className)} />;
  if (getConfigurable(widget)) {
    el = (
      <Link className="flex-1 flex items-stretch overflow-hidden" href={`/widgets/${encodeURIComponent(id ?? name)}/edit`}>
        {el}
      </Link>
    );
  } else {
    el = (
      <div className='flex-1 items-stretch'>{el}</div>
    )
  }
  return (
    <>
      <h3 className="text-gray-400 text-sm">{(widget.configureComponent ? props?.visualize?.title : undefined) ?? widget.displayName}</h3>
      <WidgetContextProvider value={{
        props,
        enabled: false,
        editingLayout: true,
        onPropChange: () => {},
        configuring: false,
        configurable: false,
      }}>
        {el}
      </WidgetContextProvider>
    </>
  );
}

export default Section;