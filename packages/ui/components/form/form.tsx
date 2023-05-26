import { HTMLProps, ReactNode, useEffect } from 'react';
import { DeepPartial, EventType, FieldPath, FieldValues, FormProvider, useForm } from 'react-hook-form';
import useRefCallback from '../../hooks/ref-callback';

export type FormValuesChangeHandler<TFieldValues extends FieldValues> = (value: DeepPartial<TFieldValues>, info: { name?: FieldPath<TFieldValues>, type?: EventType }) => void

export interface FormProps<TFieldValues extends FieldValues> extends Pick<HTMLProps<any>, 'className' | 'style' | 'id' | 'children'> {
  values?: TFieldValues;
  onChange?: FormValuesChangeHandler<TFieldValues>;
  children?: ReactNode;
}

export function Form<TFieldValues extends FieldValues = FieldValues> ({ values, onChange, ...props }: FormProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    values,
  });

  onChange = useRefCallback(onChange);

  useEffect(() => {
    const sub = form.watch(onChange);
    return () => sub.unsubscribe();
  }, [form.watch]);

  return (
    <FormProvider {...form}>
      <form {...props} />
    </FormProvider>
  );
}
