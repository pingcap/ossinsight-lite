import { Select, stringSelect } from '@ossinsight-lite/ui/components/select';
import { forwardRef, SelectHTMLAttributes } from 'react';

export interface ColumnSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  onChange?: (...event: any[]) => void;
  value?: string;
  name?: string;
}

const axisTypes = ['category', 'value', 'time'];

const AxisTypeSelect = forwardRef<HTMLButtonElement | null, ColumnSelectProps>(({
  onChange,
  value,
  name,
  ...props
}, ref) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      options={axisTypes}
      forwardedButtonRef={ref}
      {...stringSelect}
    />
  );
});

const self = (k: string) => k;

export default AxisTypeSelect;
