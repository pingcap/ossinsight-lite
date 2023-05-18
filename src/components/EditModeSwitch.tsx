import * as Switch from '@radix-ui/react-switch';
import { SwitchProps } from '@radix-ui/react-switch';

import clsx from 'clsx';
import RoughCircle from '@ossinsight-lite/ui/components/roughness/shape/circle';
import RoughRoundedRect from '@ossinsight-lite/ui/components/roughness/shape/rounded-rect';

export type EditModeSwitchProps = Pick<SwitchProps, 'checked' | 'onCheckedChange' | 'className'>

export default function EditModeSwitch ({ className, ...props }: EditModeSwitchProps) {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <label className="text-gray-900 text-[15px] leading-none pr-[15px] cursor-pointer" htmlFor="edit-mode">
        Edit mode
      </label>
      <Switch.Root
        className="cursor-pointer w-[42px] h-[25px] relative outline-none transition-shadow"
        id="edit-mode"
        {...props}
      >
        <Switch.Thumb className="block relative w-[21px] h-[21px] rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]">
          <RoughCircle color={props.checked ? '#66ff66' : '#333333'} spacing={2} />
        </Switch.Thumb>
        <RoughRoundedRect color='#777777' spacing={2} />
      </Switch.Root>
    </div>
  );
}
