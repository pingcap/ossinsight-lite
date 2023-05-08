import { useParams } from 'react-router';
import layout, { save } from 'widgets:layout';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import widgetsManifest from '../widgets-manifest';
import clsx from 'clsx';

export default function EditWidgetInstance () {
  const params = useParams<{ id: string }>();
  const item = useMemo(() => {
    return layout.find((item: any) => item.id === params.id);
  }, [params.id]);

  const widget = useMemo(() => {
    if (!item) {
      return undefined;
    }
    return widgetsManifest[item.name];
  }, [item?.name]);

  const Component = useMemo(() => {
    if (widget) {
      return lazy(() => widget.module().then(module => {
        const Component = module.default;
        return {
          default: (props: any) => {
            const [userProps, setUserProps] = useState(() => ({}));

            const handlePropChange = useCallback((key: string, value: string) => {
              setUserProps(props => ({ ...props, [key]: value }));
              item.props[key] = value;
              save(layout);
            }, []);

            return (
              <Component
                {...props}
                className={clsx('w-full h-full', props.className)}
                {...item.props}
                {...userProps}
                {...module.configurablePropsOverwrite}
                onPropChange={handlePropChange}
              />
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

  if (!item) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-700">
        Widget not found
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="p-2 bg-gray-200 text-gray-700 border-b flex gap-2 items-center h-[36px]">
        <span>
          {'Editing '}
          <b>{item.name}#{item.id}</b>
        </span>
        <span className='flex-1'/>
        <button className='text-sm bg-gray-700 rounded text-white px-2'>
          Duplicate
        </button>
        <button className='text-sm bg-red-700 rounded text-white px-2'>
          Delete
        </button>
      </div>
      <div className="widget w-full h-[calc(100%-36px)]">
        <Suspense
          fallback="loading..."
        >
          <Component />
        </Suspense>
      </div>
    </div>
  );
}