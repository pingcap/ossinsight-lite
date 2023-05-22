import React, { ForwardedRef, HTMLProps, useEffect } from 'react';
import { useEventsTotal } from './hook';
import AnimatedNumbers from 'react-awesome-animated-number';
import clsx from 'clsx';

export default function Widget ({ ...props }: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  const { totalEvents, subscribe, unsubscribe } = useEventsTotal();

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, []);

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
