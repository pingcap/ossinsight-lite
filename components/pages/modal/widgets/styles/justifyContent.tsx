
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { AlignIcons } from './alignIcons';
import { FieldProps } from './common';
import { useStyle } from './hooks';

export function JustifyContentSwitch ({ title, id, icons: { Start, Center, End } }: FieldProps & { icons: AlignIcons }) {
  const [justifyContent, setJustifyContent] = useStyle(id, 'justifyContent', 'center');

  return (
    <div className="flex items-center justify-between gap-2 text-gray-700">
      <span>{title ?? 'Justify content'}:</span>
      <ToggleGroup.Root
        type="single"
        className="toggle-group"
        value={justifyContent}
        onValueChange={setJustifyContent}
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
