import * as Switch from '@radix-ui/react-switch';
import { SwitchProps } from '@radix-ui/react-switch';
import clsx from 'clsx';

export type EditModeSwitchProps = Pick<SwitchProps, 'checked' | 'onCheckedChange' | 'className'>

export default function EditModeSwitch ({ className, ...props }: EditModeSwitchProps) {
  return (
    <div className={clsx('flex items-center', className)}>
      <label className="text-gray-900 text-[15px] leading-none pr-[15px] cursor-pointer" htmlFor="edit-mode">
        Edit mode
      </label>
      <Switch.Root
        className="cursor-pointer w-[42px] h-[25px] bg-gray-500 rounded-full relative shadow-[0_2px_8px] shadow-gray-500 focus:shadow-[0_0_0_2px] focus:shadow-gray-700 data-[state=checked]:bg-gray-700 outline-none transition-shadow"
        id="edit-mode"
        {...props}
      >
        <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-gray-500 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  );
}
