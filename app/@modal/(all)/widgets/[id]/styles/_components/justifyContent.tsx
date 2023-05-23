import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useStyle } from '@/app/@modal/(all)/widgets/[id]/styles/_components/hooks';
import { FieldProps } from '@/app/@modal/(all)/widgets/[id]/styles/_components/common';
import AlignStart from './icons/align-start.svg';
import AlignCenter from './icons/align-center.svg';
import AlignEnd from './icons/align-end.svg';

export function JustifyContentSwitch ({ id }: FieldProps) {
  const [justifyContent, setJustifyContent] = useStyle(id, 'justifyContent', 'center');

  return (
    <div className='flex items-center justify-between gap-2 text-gray-700'>
      <span>Horizontal Align: </span>
      <ToggleGroup.Root
        type="single"
        className="toggle-group"
        value={justifyContent}
        onValueChange={setJustifyContent}
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
