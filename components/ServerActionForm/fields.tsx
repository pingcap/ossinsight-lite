import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import clsx from 'clsx';
import { ButtonHTMLAttributes, cloneElement, forwardRef, InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ disabled, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <input {...props} disabled={pending || disabled} ref={ref} />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ disabled, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <textarea {...props} disabled={pending || disabled} ref={ref} />
  );
});

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(({ disabled, children, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <button {...props} disabled={pending || disabled} ref={ref}>
      <span>
        {children}
      </span>
      <LoadingIndicator className={clsx('transition-all', pending ? 'w-[1em] opacity-100' : 'w-0 opacity-0')} />
    </button>
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ disabled, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <select {...props} disabled={pending || disabled} ref={ref} />
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
      {label && <label htmlFor={children.props.id ?? id}>{label}</label>}
      {cloneElement(children, { id: children.props.id ?? id, name })}
    </div>
  );
};
