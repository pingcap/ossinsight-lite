import * as RuiSelect from '@radix-ui/react-select';
import clsx from 'clsx';
import { CSSProperties, ReactNode, useMemo, useState } from 'react';
import useRefCallback from '../../hooks/ref-callback.ts';
import './style.scss';

export type SelectProps<T> = {
  className?: string
  style?: CSSProperties
  options: T[]
  value: T | null
  getKey (value: T): string;
  onValueChange: (value: T | null) => void
  renderOption: (value: T, selected: boolean) => ReactNode;
  renderOptionLabel?: (value: T, open: boolean) => ReactNode;
  selectItemProps?: (value: T, selected: boolean) => RuiSelect.PrimitiveDivProps;
}

// TODO: <select hidden> ref for standard html forms
export function Select<T> ({ value, onValueChange, options, getKey, renderOptionLabel, renderOption, selectItemProps, className, style }: SelectProps<T>) {
  const [selected, setSelected] = useState(() => getKey(value));
  const [open, setOpen] = useState(false);

  const optionsMap = useMemo(() => {
    const map = new Map<string, T>();
    for (const option of options) {
      map.set(getKey(option), option);
    }
    return map;
  }, [options]);

  const handleValueChange = useRefCallback((key: string) => {
    setSelected(key);
    onValueChange(optionsMap.get(key) ?? null);
  });

  return (
    <RuiSelect.Root value={selected} onValueChange={handleValueChange} open={open} onOpenChange={setOpen}>
      <RuiSelect.Trigger className={clsx('select-trigger', className)} style={style}>
        {renderOptionLabel?.(value, open) ?? renderOption(value, false)}
      </RuiSelect.Trigger>
      <RuiSelect.Portal className="select-content">
        <RuiSelect.Content position="popper">
          <RuiSelect.Viewport>
            {options.map(option => {
              const key = getKey(option);
              const isSelected = selected === key;
              const itemProps = selectItemProps?.(option, isSelected);
              return (
                <RuiSelect.Item
                  key={key}
                  value={key}
                  aria-selected={isSelected}
                  {...itemProps}
                  className={clsx('select-item', itemProps?.className, { selected: isSelected })}
                >
                  {renderOption(option, isSelected)}
                </RuiSelect.Item>
              );
            })}
          </RuiSelect.Viewport>
        </RuiSelect.Content>
      </RuiSelect.Portal>
    </RuiSelect.Root>
  );
}
