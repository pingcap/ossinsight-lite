import { DashboardContext } from '@/components/pages/Dashboard/context';
import { EditingLayer } from '@/components/pages/Dashboard/EditingLayer';
import ExploreLayer from '@/components/pages/Dashboard/ExploreLayer';
import { useWidget } from '@/store/features/widgets';
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
  const { showBorder, ...props } = itemProps;
  const widget = useWidget(name);

  el = <WidgetCoordinator name={name} _id={id} props={{ ...props, className: clsx('w-full h-full', props.className) }} ref={ref} />;

  el = (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xl text-gray-400" ref={ref}><LoadingIndicator /> Loading...</div>}>
      {el}
    </Suspense>
  );

  if (editing) {
    el = (
      <>
        {el}
        <EditingLayer
          id={id}
        />
      </>
    );
  } else {
    el = (
      <>
        {el}
        <ExploreLayer id={id} />
      </>
    );
  }

  return (
    <div className={clsx('w-full h-full relative rounded-lg border-opacity-0 border border-gray-200 bg-white bg-opacity-80 overflow-hidden', !editing && 'hover:border-dashed hover:border-opacity-100', !editing && showBorder && 'border-opacity-100', className)} {...rest}>
      {el}
      {children}
    </div>
  );
});
