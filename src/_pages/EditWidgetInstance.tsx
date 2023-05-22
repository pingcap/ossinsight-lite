'use client';
import { forwardRef, lazy, Suspense, useMemo } from 'react';
import widgetsManifest from '../widgets-manifest';
import clsx from 'clsx';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { getConfigurable } from '../utils/widgets';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { library } from '@/app/bind';
import clientOnly from '@/src/utils/clientOnly';
import { LibraryItem } from '@/src/types/config';

function EditWidgetInstance ({ id, item }: { id: string, item: LibraryItem}) {

  const { name, props } = item;

  const widget = useMemo(() => {
    if (!name) {
      return undefined;
    }
    return widgetsManifest[name];
  }, [name]);

  const Component = useMemo(() => {
    if (widget) {
      return lazy(() => widget.module().then(module => {
        const Component = forwardRef(module.default);
        return {
          default: (props: any) => {
            const handlePropChange = useRefCallback((key: string, value: string) => {
              library.update(id, (item) => {
                item.props = { ...props, [key]: value };
                return item;
              });
            });

            return (
              <WidgetContext.Provider
                value={{
                  configurable: getConfigurable(module, props) ?? false,
                  enabled: false,
                  editingLayout: false,
                  onPropChange: handlePropChange,
                  props: { ...props, ...module.configurablePropsOverwrite },
                  configure () {},
                }}
              >
                <Component
                  {...props}
                  {...module.configurablePropsOverwrite}
                  className={clsx('w-full h-full', module.configurablePropsOverwrite?.className, props.className)}
                />
              </WidgetContext.Provider>
            );
          },
        };
      }));
    } else {
      return () => {
        return <div>No such widget</div>;
      };
    }
  }, [widget]);

  if (!name) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-700 gap-4">
        Widget not found
        <Link href="/">HOME</Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-40px)]">
      <div className="w-full h-full">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
              Widget loading...
            </div>
          }
        >
          <Component {...props} />
        </Suspense>
      </div>
    </div>
  );
}

export default clientOnly(EditWidgetInstance)
