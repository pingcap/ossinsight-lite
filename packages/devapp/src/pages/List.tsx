import widgetsManifest from '../widgets-manifest';
import { ReactBindCollection, useCollection, useWatchReactiveValue } from '@oss-widgets/ui/hooks/bind';
import { wrapSuspense } from '@oss-widgets/ui/utils/suspense';
import { LibraryItem } from '../types/config';
import { forwardRef, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { filter, Unsubscribable } from 'rxjs';
import { BindingTypeEvent } from '@oss-widgets/ui/hooks/bind/types';
import { ReactiveValue } from '@oss-widgets/ui/hooks/bind/ReactiveValueSubject';
import clsx from 'clsx';
import { WidgetContextProvider } from '../components/WidgetContext';
import { Link } from 'react-router-dom';
import { getConfigurable } from '../utils/widgets';
import PlusIcon from '../icons/plus.svg';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';

const names = Object.keys(widgetsManifest).sort();

function useWidgets (library: ReactBindCollection<LibraryItem>, name: string) {
  const filterFn = (item: ReactiveValue<LibraryItem>) => item.current.name === name;
  const [items, setItems] = useState(() => library.rawValues.filter(filterFn));

  useEffect(() => {
    let onceLoadSub: Unsubscribable | undefined;
    if (library.isNeedLoaded) {
      onceLoadSub = library.onceLoaded(() => setItems(library.rawValues.filter(filterFn)));
    } else {
      setItems(library.rawValues.filter(filterFn));
    }

    const sub = library.subscribeAll()
      .pipe(filter(([item, _, ev]) => ev !== BindingTypeEvent.UPDATED && filterFn(item)))
      .subscribe(() => {
        setItems(library.rawValues.filter(filterFn));
      });

    return () => {
      onceLoadSub?.unsubscribe();
      sub.unsubscribe();
    };
  }, []);

  return items;
}

function List () {
  const library = useCollection('library');

  return (
    <div className="container m-auto py-4">
      <h1 className="text-xl">Widgets list</h1>
      {names.map(name => (
        <section key={name} className="mt-8">
          <h2 className="text-lg">{name}</h2>
          <Section library={library} name={name} />
        </section>
      ))}
    </div>
  );
}

function Section ({ library, name }: { library: ReactBindCollection<LibraryItem>, name: string }) {
  const items = useWidgets(library, name);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Item key={item.current.id ?? item.current.name} item={item} />
      ))}
      {items.length === 0 && (
        <li className="text-gray-400 text-xl">No widgets</li>
      )}
      <Add name={name} library={library} />
    </ul>
  );
}

function Item ({ item: reactiveItem }: { item: ReactiveValue<LibraryItem> }) {
  const { name, id, props } = useWatchReactiveValue(reactiveItem);

  return (
    <li className="border border-gray bg-white rounded text-gray-700 flex flex-col gap-4 p-2" key={name}>
      <h3 className="text-gray-400 text-sm">{id ?? name}</h3>
      <div className="h-[209px] flex justify-center items-center">
        <Widget id={id} name={name} props={props} />
      </div>
    </li>
  );
}

function Add ({ name, library }: { library: ReactBindCollection<LibraryItem>, name: string }) {
  const [configurable, setConfigurable] = useState(false);
  const [defaultProps, setDefaultProps] = useState<any>();
  useEffect(() => {
    widgetsManifest[name].module().then(module => {
      setConfigurable(getConfigurable(module));
      setDefaultProps(module.defaultProps);
    });
  }, [name]);

  const handleAdd = useRefCallback(() => {
    const id = `${name}-${Math.round(Date.now())}`;
    library.add(id, {
      id,
      name,
      props: defaultProps,
    });
  });

  if (configurable) {
    return (
      <li className="border-4 border-dashed border-white rounded text-white p-2">
        <button className="flex w-full justify-center items-center h-[263px]" onClick={handleAdd}>
          <PlusIcon width={56} height={56} />
        </button>
      </li>
    );
  }

  return null;
}

function Widget ({ id, name, props }: { id: string | undefined, name: string, props: any }) {
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
                  configure () { },
                }}>
                  <Component {...props} {...module.widgetListItemPropsOverwrite} ref={ref} />
                </WidgetContextProvider>
              );
            if (getConfigurable(module, props)) {
              return (
                <Link className="w-full h-full flex justify-center items-center" to={`/edit/${encodeURIComponent(id ?? name)}`}>
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

export default function () {
  return wrapSuspense(<div id="widget-list-page"><List /></div>);
}
