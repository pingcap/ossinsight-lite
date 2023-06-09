'use client';
import WidgetContext, { noDataOptions } from '@/packages/ui/context/widget';
import { useResolvedWidget } from '@/store/features/widgets';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import { useVisible } from '@/utils/visible';
import clsx from 'clsx';

export interface WidgetPreviewProps extends LibraryItem {
  id?: string | undefined;
  name: string;
  props: any;
  className?: string;
}

function WidgetDetails ({ id, name, className, props }: WidgetPreviewProps) {
  const widget = useResolvedWidget(name);
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
      ...noDataOptions,
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
