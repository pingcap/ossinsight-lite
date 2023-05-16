import { cloneElement, ReactElement, ReactNode, useId } from 'react';
import { ControllerRenderProps, FieldPath, FieldValues, useController } from 'react-hook-form';

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

  const { field } = useController({ name });

  return (
    <div className="flex gap-2 items-center">
      <label className="text-white max-w-[120px]" htmlFor={htmlId}>{label}</label>
      {cloneElement(control, { ...field, id: htmlId })}
    </div>
  );
}
