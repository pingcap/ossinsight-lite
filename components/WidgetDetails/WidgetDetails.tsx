'use client';
import { widgets } from '@/core/bind-client';
import WidgetContext from '@/packages/ui/context/widget';
import { readItem } from '@/packages/ui/hooks/bind';
import { useVisible } from '@/packages/ui/hooks/visible';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import clsx from 'clsx';

export interface WidgetPreviewProps extends LibraryItem {
  id?: string | undefined;
  name: string;
  props: any;
  className?: string;
}

function WidgetDetails ({ id, name, className, props }: WidgetPreviewProps) {
  const widget = readItem(widgets, name).current;
  const Details = widget.WidgetDetails;
  if (!Details) {
    return <></>;
  }
  const { ref: visibleRef, visible } = useVisible();

  return (
    <WidgetContext.Provider value={{
      visible,
      props,
      onPropChange: () => {},
      configuring: false,
      creating: false,
    }}>
      <Details
        {...props}
        className={clsx('flex-1 h-full', props.className, className)}
        ref={visibleRef}
      />
    </WidgetContext.Provider>
  );
}

export default clientOnly(WidgetDetails);
