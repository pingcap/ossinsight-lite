import { useRecentEvents } from './hook';
import { AsyncIntervalState, useAsyncInterval } from '../../../utils/async-interval';
import { renderEvent } from './renderEvent';
import { ForwardedRef, HTMLProps } from 'react';
import clsx from 'clsx';
import { Alert } from '../../../components/alert';
import AlertIcon from '../../../icons/octicons/alert.svg';
import RoughSvg from '@oss-widgets/roughness/components/RoughSvg';
import cu from '../../oh-my-github/curr_user.sql?unique';

export default function Widget (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  const { events, reload } = useRecentEvents();

  const { error, state } = useAsyncInterval(reload, 60000);

  return (
    <div {...props} ref={ref} className={clsx('recent-events p-4', props.className)}>
      <div className='mb-4'>Recent github events of @{cu.login}</div>
      {error && (
        <Alert title="Error" icon={<RoughSvg><AlertIcon width={24} height={24} /></RoughSvg>}>
          {error}
        </Alert>
      )}
      {state === AsyncIntervalState.READY && (
        <ul className="flex flex-col gap-2">
          {events.map(ev => (
            <li key={ev.id}>
              {renderEvent(ev)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}