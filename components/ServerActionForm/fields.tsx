import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import clsx from 'clsx';
import { ButtonHTMLAttributes, cloneElement, forwardRef, InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ disabled, type, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <input {...props} className={clsx(props.className, 'text-input')} disabled={pending || disabled} ref={ref} type={type === 'button' ? undefined : type}/>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ disabled, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <textarea {...props} className={clsx(props.className, 'text-input')} disabled={pending || disabled} ref={ref} />
  );
});

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(({ disabled, children, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <button {...props} className={clsx(props.className, 'btn', { 'btn-primary': props.type !== 'button' })} disabled={pending || disabled} ref={ref}>
      <span>
        {children}
      </span>
      <LoadingIndicator className={clsx('transition-all', pending ? 'w-[1em] opacity-100 mx-0' : 'mx-[-4px] w-0 opacity-0')} />
    </button>
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ disabled, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <select {...props} className={clsx(props.className, 'text-input')} disabled={pending || disabled} ref={ref} />
  );
});

export interface FormControlProps {
  className?: string;
  label?: ReactNode;
  name: string;
  children: ReactElement;
}

export const FormControl = function ({ className, label, name, children }: FormControlProps) {
  const id = `name-${useId()}`;

  return (
    <div className={clsx('form-control', className)}>
      {label && <label htmlFor={children.props.id ?? id}>{label}</label>}
      {cloneElement(children, { id: children.props.id ?? id, name })}
    </div>
  );
};
