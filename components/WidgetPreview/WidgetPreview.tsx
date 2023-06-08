'use client';
import WidgetContext, { noDataOptions } from '@/packages/ui/context/widget';
import { useVisible } from '@/packages/ui/hooks/visible';
import { useResolvedWidget } from '@/store/features/widgets';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import clsx from 'clsx';

export interface WidgetPreviewProps extends LibraryItem {
  id?: string | undefined;
  name: string;
  props: any;
  className?: string;
  onClick?: () => void;
}

function WidgetPreview ({ id, name, className, onClick, props }: WidgetPreviewProps) {
  const widget = useResolvedWidget(name);
  const { Widget, Icon } = widget;
  const { ref: visibleRef, visible } = useVisible();

  return (
    <>
      <h3 className="text-gray-400 text-sm inline-flex gap-2 items-center">
        {Icon && <Icon />}
        {props?.title ?? widget.displayName}
      </h3>
      <div className={clsx('flex-1 flex items-stretch overflow-hidden', onClick && 'cursor-pointer')} onClick={onClick}>
        <WidgetContext.Provider value={{
          visible,
          props,
          onPropChange: () => {},
          configuring: false,
          creating: false,
          ...noDataOptions,
        }}>
          <Widget
            {...props}
            {...widget.widgetListItemPropsOverwrite}
            className={clsx('flex-1', props.className, widget.widgetListItemPropsOverwrite?.className, className)}
            ref={visibleRef}
          />
        </WidgetContext.Provider>
      </div>
    </>
  );
}

export default clientOnly(WidgetPreview);
