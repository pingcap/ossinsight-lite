import * as RuiPopover from '@radix-ui/react-popover';
import { HexAlphaColorPicker } from 'react-colorful';

export interface ColorPickerProps {
  id?: string;
  name?: string;

  color: string;

  onColorChange (color: string): void;
}

export default function ColorPicker ({ id, name, color, onColorChange }: ColorPickerProps) {
  return (
    <RuiPopover.Root>
      <RuiPopover.Trigger asChild>
        <button className='w-6 h-6 rounded block border' style={{ backgroundColor: color }}>
          <input type="color" id={id} name={name} value={color} readOnly hidden />
        </button>
      </RuiPopover.Trigger>
      <RuiPopover.Portal>
        <RuiPopover.Content className='relative z-30 rounded p-4 bg-gray-50 shadow-xl'>
          <RuiPopover.Arrow className='fill-gray-50' />
          <HexAlphaColorPicker
            color={color}
            onChange={onColorChange}
          />
        </RuiPopover.Content>
      </RuiPopover.Portal>
    </RuiPopover.Root>
  );
}
