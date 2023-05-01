import React, { HTMLProps, useEffect } from 'react';
import { useEventsTotal } from './hook';
import AnimatedNumbers from 'react-awesome-animated-number';

export default function Widget ({ ...props }: HTMLProps<HTMLDivElement>) {
  const { totalEvents, subscribe, unsubscribe } = useEventsTotal();
  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, []);

  return (
    <div {...props}>
      <div className='p-2'>
        <div>OSSInsight Total Events</div>
        <div className={'font-bold font-mono'}>
          <AnimatedNumbers
            value={totalEvents}
            size={14}
            hasComma
          />
        </div>
      </div>
    </div>
  );
}
