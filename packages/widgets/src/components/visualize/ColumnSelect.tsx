import { Select, stringSelect } from '@ossinsight-lite/ui/components/select';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { forwardRef, SelectHTMLAttributes, useContext, useMemo } from 'react';
import { VisualizeContext } from './context';

export interface ColumnSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  onChange?: (...event: any[]) => void;
  value?: string;
  name?: string;
}

const ColumnSelect = forwardRef<HTMLButtonElement | null, ColumnSelectProps>(({
  onChange,
  value,
  name,
  ...props
}, ref) => {
  const { columns, portal, selectedColumns } = useContext(VisualizeContext);

  const options = useMemo(() => {
    return columns?.map(c => c.name) ?? [];
  }, [columns]);

  const getDisabled = useRefCallback((column: string) => {
    return value !== column && selectedColumns.includes(column);
  });

  return (
    <Select
      value={value}
      onValueChange={onChange}
      options={options}
      forwardedButtonRef={ref}
      getDisabled={getDisabled}
      {...stringSelect}
    />
  );
});

const self = (k: string) => k;

export default ColumnSelect;
