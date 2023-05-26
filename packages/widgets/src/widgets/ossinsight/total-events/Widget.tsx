import WidgetContext from '@ossinsight-lite/ui/context/widget';
import clsx from 'clsx';
import React, { ForwardedRef, HTMLProps, useContext, useEffect } from 'react';
import AnimatedNumbers from 'react-awesome-animated-number';
import { useEventsTotal } from './hook';

export default function Widget ({ ...props }: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  const { visible } = useContext(WidgetContext);

  const { totalEvents, subscribe, unsubscribe } = useEventsTotal();

  useEffect(() => {
    if (visible) {
      subscribe();
      return unsubscribe;
    }
  }, [visible]);

  return (
    <div ref={ref} {...props} className={clsx('flex items-center justify-center', props.className)}>
      <div className="p-2">
        <div>OSSInsight Total Events</div>
        <div className={'font-bold font-sketch text-gray-800'}>
          <AnimatedNumbers
            value={totalEvents}
            size={18}
            hasComma
          />
        </div>
      </div>
    </div>
  );
}
