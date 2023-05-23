import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useStyle } from '@/app/@modal/(all)/widgets/[id]/styles/_components/hooks';
import { FieldProps } from '@/app/@modal/(all)/widgets/[id]/styles/_components/common';
import AlignStart from './icons/align-top.svg';
import AlignCenter from './icons/align-middle.svg';
import AlignEnd from './icons/align-bottom.svg';

export function AlignItemsSwitch ({ id }: FieldProps) {
  const [alignItems, setAlignItems] = useStyle(id, 'alignItems', 'center');

  return (
    <div className="flex items-center justify-between gap-2 text-gray-700">
      <span>Vertical Align: </span>
      <ToggleGroup.Root
        type="single"
        className="toggle-group"
        value={alignItems}
        onValueChange={setAlignItems}
      >
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="flex-start">
          <AlignStart />
        </ToggleGroup.ToggleGroupItem>
        <span className="toggle-group-divider" />
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="center">
          <AlignCenter />
        </ToggleGroup.ToggleGroupItem>
        <span className="toggle-group-divider" />
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="flex-end">
          <AlignEnd />
        </ToggleGroup.ToggleGroupItem>
      </ToggleGroup.Root>
    </div>
  );
}
