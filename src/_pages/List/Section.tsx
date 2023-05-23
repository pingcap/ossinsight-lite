'use client';
import { LibraryItem } from '@/src/types/config';
import { forwardRef, lazy, Suspense, useEffect, useMemo, useState, useTransition } from 'react';
import widgetsManifest from '@/src/widgets-manifest';
import { getConfigurable } from '@/src/utils/widgets';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import PlusIcon from '@/src/icons/plus.svg';
import { WidgetContextProvider } from '@/src/components/WidgetContext';
import Link from 'next/link';
import clsx from 'clsx';

function Section ({ name, items, onAdd }: { name: string, items: LibraryItem[], onAdd: (item: LibraryItem) => Promise<any> }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Item key={item.id ?? item.name} item={item} />
      ))}
      {items.length === 0 && (
        <li className="text-gray-400 text-xl">No widgets</li>
      )}
      <Add name={name} onAdd={onAdd} />
    </ul>
  );
}

function Item ({ item: { name, id, props } }: { item: LibraryItem }) {
  return (
    <li className="border border-gray bg-white rounded text-gray-700 flex flex-col gap-4 p-2" key={name}>
      <h3 className="text-gray-400 text-sm">{id ?? name}</h3>
      <div className="h-[209px] flex justify-center items-center">
        <Widget className='font-sketch' id={id} name={name} props={props} />
      </div>
    </li>
  );
}

function Add ({ name, onAdd }: { name: string, onAdd: (item: LibraryItem) => Promise<void> }) {
  let [isPending, startTransition] = useTransition();
  const [configurable, setConfigurable] = useState(false);
  const [defaultProps, setDefaultProps] = useState<any>();
  useEffect(() => {
    widgetsManifest[name].module().then(module => {
      setConfigurable(getConfigurable(module));
      setDefaultProps(module.defaultProps);
    });
  }, [name]);

  const handleAdd = useRefCallback(() => {
    startTransition(() => {
      const id = `${name}-${Math.round(Date.now())}`;
      void onAdd({
        id,
        name,
        props: defaultProps,
      });
    });
  });

  if (configurable) {
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
  const Component = useMemo(() => {
    return lazy(() => widgetsManifest[name].module().then(module => {
      const Component = forwardRef(module.default);

      return {
        default: forwardRef((props, ref) => {
            const el =
              (
                <WidgetContextProvider value={{
                  props,
                  enabled: false,
                  editingLayout: true,
                  configurable: false,
                  onPropChange: () => {},
                  configure: '',
                  configuring: false,
                }}>
                  <Component {...props} {...module.widgetListItemPropsOverwrite} className={clsx(props.className, module.widgetListItemPropsOverwrite?.className, className)} ref={ref} />
                </WidgetContextProvider>
              );
            if (getConfigurable(module, props)) {
              return (
                <Link className="w-full h-full flex justify-center items-center" href={`/widgets/${encodeURIComponent(id ?? name)}/edit`}>
                  {el}
                </Link>
              );
            }
            return el;
          },
        ),
      };
    }));
  }, [name]);

  return (
    <Suspense fallback="Loading">
      <Component {...props} className={clsx('w-full h-full', props?.className)} />
    </Suspense>
  );
}

export default Section;