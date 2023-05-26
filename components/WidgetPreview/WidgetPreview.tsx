import { widgets } from '@/core/bind-client';
import WidgetContext from '@/packages/ui/context/widget';
import { readItem } from '@/packages/ui/hooks/bind';
import { useVisible } from '@/packages/ui/hooks/visible';
import { LibraryItem } from '@/utils/types/config';
import clsx from 'clsx';

export interface WidgetPreviewProps extends LibraryItem {
  id?: string | undefined;
  name: string;
  props: any;
  className: string;
  onClick?: () => void;
}

export default function WidgetPreview ({ id, name, className, onClick, props }: WidgetPreviewProps) {
  const widget = readItem(widgets, name).current;
  const Widget = widget.Widget;
  const { ref: visibleRef, visible } = useVisible();

  return (
    <>
      <h3 className="text-gray-400 text-sm">{(widget.ConfigureComponent ? props?.visualize?.title : undefined) ?? widget.displayName}</h3>
      <div className={clsx('flex-1 flex items-stretch overflow-hidden', onClick && 'cursor-pointer')} onClick={onClick}>
        <WidgetContext.Provider value={{
          visible,
          props,
          onPropChange: () => {},
          configuring: false,
          creating: false,
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
