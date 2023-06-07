import { DashboardContext } from '@/components/pages/Dashboard/context';
import { EditingLayer } from '@/components/pages/Dashboard/EditingLayer';
import ExploreLayer from '@/components/pages/Dashboard/ExploreLayer';
import widgetsManifest from '@/core/widgets-manifest';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import clsx from 'clsx';
import { forwardRef, ReactElement, Suspense, useContext } from 'react';
import { WidgetCoordinator } from './WidgetCoordinator';

export interface WidgetComponentProps {
  id: string;
  className?: string;
  children?: any;
}


export const WidgetComponent = forwardRef<HTMLDivElement, WidgetComponentProps>(({ ...componentProps }, ref) => {
  let el: ReactElement;

  const { editing } = useContext(DashboardContext);

  const { id, className, children, ...rest } = componentProps;

  const { props: itemProps, name } = useWatchItemFields('library', id, ['name', 'props']);
  const props = itemProps;

  if (!name.startsWith('internal:') && !widgetsManifest[name]) {
    el = <div className="text-sm text-gray-400">Unknown widget {name}, check your repository version.</div>;
  } else {
    el = <WidgetCoordinator name={name} _id={id} props={{ ...props, className: clsx('w-full h-full', props.className) }} ref={ref} />;
  }

  el = (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xl text-gray-400" ref={ref}><LoadingIndicator /> Loading...</div>}>
      {el}
    </Suspense>
  );

  if (editing) {
    el = (
      <div className="relative w-full h-full">
        {el}
        <EditingLayer
          id={id}
        />
      </div>
    );
  } else {
    el = (
      <div className="relative w-full h-full">
        {el}
        <ExploreLayer id={id} />
      </div>
    );
  }

  return (
    <div className={clsx('w-full h-full rounded-lg border bg-white bg-opacity-60 overflow-hidden', className)} {...rest}>
      {el}
      {children}
    </div>
  );
});
