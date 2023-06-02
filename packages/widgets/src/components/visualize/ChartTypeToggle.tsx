import { BarChartIcon } from '@radix-ui/react-icons';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { forwardRef } from 'react';
import GraphUpIcon from '../../icons/twbs/graph-up.svg';
import TableIcon from '../../icons/twbs/table.svg';

interface ChartTypeToggleProps<T> {
  className?: string;
  value: T;
  onChange: (value: T) => void;
}

const itemClasses = 'bg-opacity-60 hover:bg-gray-200 color-gray-700 data-[state=on]:bg-gray-300 flex h-[28px] w-[28px] items-center justify-center bg-white text-base leading-4 focus:z-10 focus:outline-none transition-colors';

const ChartTypeToggle = forwardRef<HTMLDivElement, ChartTypeToggleProps<any>>(({ className, value, onChange }, ref) => {
  return (
    <ToggleGroup.Root
      className={clsx('inline-flex bg-gray-100 rounded border border-gray-100 space-x-px overflow-hidden', className)}
      type="single"
      ref={ref}
      value={value}
      onValueChange={onChange}
    >
      <ToggleGroup.Item className={itemClasses} value="table" aria-label="Raw table">
        <TableIcon width={14} height={14} />
      </ToggleGroup.Item>
      <ToggleGroup.Item className={itemClasses} value="chart:line" aria-label="Line chart">
        <GraphUpIcon width={14} height={14} />
      </ToggleGroup.Item>
      <ToggleGroup.Item className={itemClasses} value="chart:bar" aria-label="Bar chart">
        <BarChartIcon width={14} height={14} />
      </ToggleGroup.Item>
      <ToggleGroup.Item className={itemClasses} value="gauge" aria-label="Gauge">
        <span className='text-sm'>
          42
        </span>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
});

export default ChartTypeToggle;
