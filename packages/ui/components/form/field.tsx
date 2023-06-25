import { ChangeEvent, cloneElement, ReactElement, ReactNode, useCallback, useId, useMemo } from 'react';
import { ControllerRenderProps, FieldPath, FieldValues, get } from 'react-hook-form';
import { useFormContext } from './context.ts';

export interface FieldControlProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends ControllerRenderProps<TFieldValues, TName> {
  id?: string,
}

export interface BaseFieldProps<F extends FieldValues, N extends FieldPath<F>> {
  label: ReactNode;
  control: ReactElement<FieldControlProps<F, N>>;
  name: N;
}

export function Field<F extends FieldValues, N extends FieldPath<F>> ({ name, label, control }: BaseFieldProps<F, N>) {
  const id = useId();
  const htmlId = `${id}-${name}`;

  const { values, onChange } = useFormContext<F>();

  const handleChange = useCallback((ev: any) => {
    if (ev == null) {
      return;
    }
    if (isChangeEvent(ev)) {
      onChange(name, ev.target.value);
    } else {
      onChange(name, ev as any);
    }
  }, [name]);

  const value = useMemo(() => get(values, name), [values, name]);

  return (
    <div className="form-control">
      <label htmlFor={htmlId}>{label}</label>
      {cloneElement(control, { value, name, onChange: handleChange, id: htmlId })}
    </div>
  );
}

function isChangeEvent (ev: any): ev is ChangeEvent<any> {
  return 'eventPhase' in ev && 'type' in ev && ev.type === 'change';
}
