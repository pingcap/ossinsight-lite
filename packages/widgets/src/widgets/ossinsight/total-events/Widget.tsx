import React, { HTMLProps, useEffect, useLayoutEffect } from 'react';
import { useEventsTotal } from './hook';
import AnimatedNumbers from 'react-awesome-animated-number';
import { prerenderMode, usePrerenderCallback } from '@oss-widgets/runtime';

export default function Widget ({ ...props }: HTMLProps<HTMLDivElement>) {
  const { totalEvents, subscribe, unsubscribe } = useEventsTotal();
  const prerenderCallback = usePrerenderCallback();

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    if (totalEvents !== 0) {
      prerenderCallback();
    }
  }, [totalEvents]);

  return (
    <div {...props}>
      <div className="p-2">
        <div>OSSInsight Total Events</div>
        <div className={'font-bold font-sketch text-gray-800'}>
          {prerenderMode
            ? <style className="block text-[14px]">{totalEvents.toLocaleString()}</style>
            : <AnimatedNumbers
              value={totalEvents}
              size={14}
              hasComma
            />}
        </div>
      </div>
    </div>
  );
}
