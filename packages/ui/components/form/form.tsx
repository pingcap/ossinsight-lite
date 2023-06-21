import { createDraft, Draft, finishDraft } from 'immer';
import { HTMLProps, ReactNode } from 'react';
import { DeepPartial, EventType, FieldPath, FieldPathValue, FieldValues, get, set } from 'react-hook-form';
import useRefCallback from '../../hooks/ref-callback';
import { FormContextProvider } from './context.ts';

export type FormValuesChangeHandler<TFieldValues extends FieldValues> = (value: DeepPartial<TFieldValues>, info: { name?: FieldPath<TFieldValues>, type?: EventType }) => void

export interface FormProps<TFieldValues extends FieldValues> extends Pick<HTMLProps<any>, 'className' | 'style' | 'id' | 'children'> {
  values?: TFieldValues;
  onChange?: (values: TFieldValues) => void;
  children?: ReactNode;
}

export function Form<TFieldValues extends FieldValues = FieldValues> ({ values, onChange, ...props }: FormProps<TFieldValues>) {
  const onFieldValueChange = useRefCallback(<P extends FieldPath<TFieldValues>> (field: P, value: FieldPathValue<TFieldValues, P>) => {
    const draft = createDraft(values);
    set(draft, field, value);
    const result = finishDraft(draft);
    onChange(result as TFieldValues);
  });

  const getField = useRefCallback(<P extends FieldPath<TFieldValues>> (path: P) => {
    return get(values, path);
  });

  const onBatchChange = useRefCallback((updater: (draft: Draft<TFieldValues>) => void) => {
    const draft = createDraft(values);
    updater(draft);
    const result = finishDraft(draft);
    onChange(result as TFieldValues);
  });

  return (
    <FormContextProvider<TFieldValues> values={values} onChange={onFieldValueChange as any} getField={getField} onBatchChange={onBatchChange}>
      <form {...props} />
    </FormContextProvider>
  );
}
