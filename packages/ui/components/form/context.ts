import { Draft } from 'immer';
import { createContext, createElement, PropsWithChildren, useContext } from 'react';
import { FieldPath, FieldPathValue } from 'react-hook-form';

export type FormContextValues<T> = {
  values: T
  onChange: <P extends FieldPath<T>>(name: FieldPath<T>, value: FieldPathValue<T, P>) => void;
  onBatchChange: (updater: (draft: Draft<T>) => void) => void;
  getField<P extends FieldPath<T>> (path: P): FieldPathValue<T, P>
}

const FormContext = createContext<FormContextValues<any>>({
  values: {},
  onChange () {},
  onBatchChange () {},
  getField () { return undefined; },
});

export function FormContextProvider<T> ({ children, ...value }: PropsWithChildren<FormContextValues<T>>) {
  return (
    createElement(FormContext.Provider, {
      value,
      children,
    })
  );
}

export function useFormContext<T> (): FormContextValues<T> {
  return useContext(FormContext);
}

