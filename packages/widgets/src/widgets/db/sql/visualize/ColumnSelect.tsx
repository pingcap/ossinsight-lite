import { forwardRef, SelectHTMLAttributes, useContext } from 'react';
import * as Select from '@radix-ui/react-select';
import { VisualizeContext } from './context';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import RoughSvg from '@ossinsight-lite/roughness/components/RoughSvg';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

export interface ColumnSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  onChange?: (...event: any[]) => void;
  onBlur?: () => void;
  value?: string;
  name?: string;
}

const ColumnSelect = forwardRef<HTMLButtonElement | null, ColumnSelectProps>(({
  onChange,
  onBlur,
  value,
  name,
  ...props
}, ref) => {
  const { columns, portal } = useContext(VisualizeContext);

  return (
    <Select.Root
      onOpenChange={useRefCallback(open => {
        if (!open) {
          onBlur();
        }
      })}
      value={value}
      onValueChange={onChange}
    >
      <Select.Trigger className="bg-transparent text-white inline-flex items-center justify-center outline-none" ref={ref}>
        <Select.Value>
          {value}
        </Select.Value>
        <Select.Icon>
          <RoughSvg>
            <ChevronDownIcon />
          </RoughSvg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal container={portal}>
        <Select.Content className="overflow-hidden z-50 max-h-[280px] bg-white rounded shadow" position="popper">
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <RoughSvg>
              <ChevronUpIcon />
            </RoughSvg>
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">
            {columns?.map(column => (
              <ColumnItem name={column.name} key={column.name} />
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <RoughSvg>
              <ChevronDownIcon />
            </RoughSvg>
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
});

const ColumnItem = forwardRef<HTMLDivElement, { name: string }>(({ name }, ref) => {
  return (
    <Select.Item value={name} className="text-sm cursor-pointer py-1 px-2 outline-none transition-colors hover:bg-gray-100 data-[state=checked]:bg-gray-200" ref={ref}>
      <Select.ItemText>
        {name}
      </Select.ItemText>
      <Select.ItemIndicator className="h-full inline-flex items-center justify-center ml-2">
        <RoughSvg>
          <CheckIcon />
        </RoughSvg>
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default ColumnSelect;
