'use client';
import { forwardRef, lazy, Suspense, useMemo } from 'react';
import widgetsManifest from '../widgets-manifest';
import clsx from 'clsx';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import Link from 'next/link';
import clientOnly from '@/src/utils/clientOnly';

export interface EditWidgetInstanceProps {
  name: string;
  props: any;
  onPropsChange: (key: string, value: any) => void;
}

function EditWidgetInstance ({ name, props, onPropsChange }: EditWidgetInstanceProps) {
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
            return (
              <WidgetContext.Provider
                value={{
                  configurable: false,
                  configuring: false,
                  enabled: false,
                  editingLayout: false,
                  onPropChange: onPropsChange,
                  props: { ...props, ...module.configurablePropsOverwrite },
                  configure: '',
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
  );
}

export default clientOnly(EditWidgetInstance, () => (
  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
    Widget loading...
  </div>
));
