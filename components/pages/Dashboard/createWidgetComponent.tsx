import { EditingLayer } from '@/components/pages/Dashboard/EditingLayer';
import widgetsManifest from '@/core/widgets-manifest';
import { ComponentProps } from '@ossinsight-lite/layout/src/components/Components';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import { Consume } from '@ossinsight-lite/ui/hooks/bind/types';
import clsx from 'clsx';
import { forwardRef, ReactElement, Suspense } from 'react';
import { WidgetCoordinator } from './WidgetCoordinator';

export interface WidgetComponentProps extends ComponentProps, WidgetStateProps {
  className?: string;
  dashboardName?: string;
}

export interface WidgetStateProps {
  editMode: boolean,
  active: boolean,
  onActiveChange: Consume<boolean>
}

export const WidgetComponent = forwardRef<HTMLDivElement, WidgetComponentProps>(({ ...componentProps }, ref) => {
  console.log(componentProps);
  let el: ReactElement;

  const { id, draggable, dragging, draggableProps, editMode, active, onActiveChange, className, dashboardName, ...rest } = componentProps;

  const { props: itemProps, name } = useWatchItemFields('library', id, ['name', 'props']);
  const props = { ...rest, ...itemProps };

  if (!name.startsWith('internal:') && !widgetsManifest[name]) {
    el = <div className="text-sm text-gray-400">Unknown widget {name}, check your repository version.</div>;
  } else {
    el = <WidgetCoordinator dashboardName={dashboardName} name={name} _id={id} editMode={editMode} draggable={draggable} props={{ ...props, className: clsx('w-full h-full', props.className) }} ref={ref} />;
  }

  el = (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xl text-gray-400" ref={ref}><LoadingIndicator /> Loading...</div>}>
      {el}
    </Suspense>
  );

  if (editMode) {
    el = (
      <div className="relative w-full h-full">
        {el}
        <EditingLayer
          id={id}
          draggableProps={draggableProps}
        />
      </div>
    );
  }

  return (
    <div className={clsx('widget relative rounded-lg bg-white bg-opacity-60 overflow-hidden', className)} {...rest}>
      {el}
    </div>
  );
});
