import { ButtonHTMLAttributes, cloneElement, forwardRef, InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, useContext, useId } from 'react';
import { ServerActionFormContext } from '@/src/components/ServerActionForm/context';
import { ServerActionFormState } from '@/src/components/ServerActionForm/type';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ disabled, ...props }, ref) => {
  const { state } = useContext(ServerActionFormContext);

  return (
    <input {...props} disabled={state === ServerActionFormState.PENDING || disabled} ref={ref} />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ disabled, ...props }, ref) => {
  const { state } = useContext(ServerActionFormContext);

  return (
    <textarea {...props} disabled={state === ServerActionFormState.PENDING || disabled} ref={ref} />
  );
});

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(({ disabled, ...props }, ref) => {
  const { state } = useContext(ServerActionFormContext);

  return (
    <button {...props} disabled={state === ServerActionFormState.PENDING || disabled} ref={ref} />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ disabled, ...props }, ref) => {
  const { state } = useContext(ServerActionFormContext);

  return (
    <select {...props} disabled={state === ServerActionFormState.PENDING || disabled} ref={ref} />
  );
});

export interface FormControlProps {
  label?: ReactNode;
  name: string;
  children: ReactElement;
}

export const FormControl = function ({ label, name, children }: FormControlProps) {
  const id = `name-${useId()}`;

  return (
    <div className="form-control">
      <label htmlFor={children.props.id ?? id}>{label}</label>
      {cloneElement(children, { id: children.props.id ?? id, name })}
    </div>
  );
};
