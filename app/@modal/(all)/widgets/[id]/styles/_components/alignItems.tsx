import { AlignIcons } from '@/app/@modal/(all)/widgets/[id]/styles/_components/alignIcons';
import { FieldProps } from '@/app/@modal/(all)/widgets/[id]/styles/_components/common';
import { useStyle } from '@/app/@modal/(all)/widgets/[id]/styles/_components/hooks';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

export function AlignItemsSwitch ({ title, id, icons: { Start, Center, End } }: FieldProps & { icons: AlignIcons }) {
  const [alignItems, setAlignItems] = useStyle(id, 'alignItems', 'center');

  return (
    <div className="flex items-center justify-between gap-2 text-gray-700">
      <span>{title ?? 'Align items'}:</span>
      <ToggleGroup.Root
        type="single"
        className="toggle-group"
        value={alignItems}
        onValueChange={setAlignItems}
      >
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="flex-start">
          <Start />
        </ToggleGroup.ToggleGroupItem>
        <span className="toggle-group-divider" />
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="center">
          <Center />
        </ToggleGroup.ToggleGroupItem>
        <span className="toggle-group-divider" />
        <ToggleGroup.ToggleGroupItem className="toggle-group-item" value="flex-end">
          <End />
        </ToggleGroup.ToggleGroupItem>
      </ToggleGroup.Root>
    </div>
  );
}
