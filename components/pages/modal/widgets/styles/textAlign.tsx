import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { FieldProps } from './common';
import { useStyle } from './hooks';
import AlignCenter from './icons/text-center.svg';
import AlignStart from './icons/text-left.svg';
import AlignEnd from './icons/text-right.svg';

export function TextAlignSwitch ({ id }: FieldProps) {
  const [textAlign, setTextAlign] = useStyle(id, 'textAlign', 'left');

  return (
    <div className="flex items-center justify-between gap-2 text-gray-700">
      <span>Text Align: </span>
      <ToggleGroup.Root
        type="single"
        className="toggle-group"
        value={textAlign}
        onValueChange={setTextAlign as any}
      >
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="left">
          <AlignStart />
        </ToggleGroup.ToggleGroupItem>
        <span className="toggle-group-divider" />
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="center">
          <AlignCenter />
        </ToggleGroup.ToggleGroupItem>
        <span className="toggle-group-divider" />
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="right">
          <AlignEnd />
        </ToggleGroup.ToggleGroupItem>
      </ToggleGroup.Root>
    </div>
  );
}
