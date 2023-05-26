import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { AlignIcons } from './alignIcons';
import { FieldProps } from './common';
import { useStyle } from './hooks';

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
