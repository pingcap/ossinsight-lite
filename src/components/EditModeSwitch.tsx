import * as Switch from '@radix-ui/react-switch';
import { SwitchProps } from '@radix-ui/react-switch';

import clsx from 'clsx';
import LockIcon from '@/src/icons/lock.svg';
import UnlockIcon from '@/src/icons/unlock.svg';

export type EditModeSwitchProps = Pick<SwitchProps, 'checked' | 'onCheckedChange' | 'className'>

export default function EditModeSwitch ({ className, ...props }: EditModeSwitchProps) {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <Switch.Root{...props}>
        {props.checked ? <UnlockIcon /> : <LockIcon />}
      </Switch.Root>
    </div>
  );
}
