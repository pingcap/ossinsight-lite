'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import { dashboards } from '@/app/bind';
import { widgets } from '@/app/bind-client';
import WidgetContext from '@/packages/ui/context/widget';
import { readItem } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useVisible } from '@/packages/ui/hooks/visible';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { LibraryItem } from '@/src/types/config';
import clsx from 'clsx';
import { Suspense, useContext } from 'react';

export default function Section ({ dashboardName, name, items }: { dashboardName: string, name: string, items: LibraryItem[] }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 text-xl text-gray-700">
        <b>{name}</b>
      </h3>
      <ul className="grid grid-cols-2 gap-4 p-4">
        {items.map(item => (
          <li
            key={item.id ?? item.name}
            className="h-[239px] flex border rounded justify-center items-center gap-2 bg-white shadow-none hover:shadow cursor-pointer transition-all overflow-hidden"
          >
            <Suspense fallback={<><LoadingIndicator />Widget loading</>}>
              <Item item={item} dashboardName={dashboardName} />
            </Suspense>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Item ({ item, dashboardName }: { dashboardName: string, item: LibraryItem }) {
  const widget = readItem(widgets, item.name).current;
  const Widget = widget.Widget;
  const { ref: visibleRef, visible } = useVisible();

  const { closeModal } = useContext(ModalContext);

  const handleAdd = useRefCallback(() => {
    const dashboard = dashboards.getNullable(dashboardName)?.current;
    if (dashboard) {
      const id = item.id ?? item.name;

      if (!dashboard.items.has(id)) {
        dashboard.items.add(id, {
          id,
          rect: widget.defaultRect ?? [0, 0, 8, 3],
        });
      }
    }

    closeModal();
  });

  return (
    <div className="w-full h-full flex flex-col justify-stretch" onClick={handleAdd}>
      <h4 className="p-1 text-center text-sm text-gray-400">{(widget.ConfigureComponent ? item.props?.visualize?.title : undefined) ?? widget.displayName}</h4>
      <WidgetContext.Provider
        value={{
          props: item.props,
          configuring: false,
          creating: false,
          onPropChange: () => {},
          visible,
        }}
      >
        <Widget ref={visibleRef} {...item.props} className={clsx('pointer-events-none flex-1', item.props?.className)} />
      </WidgetContext.Provider>
    </div>
  );
}
