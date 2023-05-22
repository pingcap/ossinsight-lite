'use client';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import { withFormErrorBoundary } from '@/src/utils/form';
import { ButtonHTMLAttributes, InputHTMLAttributes, useTransition } from 'react';
import { addDashboardAction, deleteDashboardAction } from '@/app/admin/dashboards/actions';

export const FormError: ErrorComponent = ({ error }) => {
  return (
    <div className="p-2 text-red-600 bg-red-200">
      {error.message}
    </div>
  );
};

export const AddDashboardForm = withFormErrorBoundary(function NewTrackingRepoForm ({ errorChildren, reset }) {
  return (
    <section>
      <h2>Add new tracking repo</h2>
      <form action={addDashboardAction} onClick={reset}>
        <FormStatus />
        {errorChildren}
        <Input name="name" placeholder="Input new dashboard name" />
        <Button type="submit">Add</Button>
      </form>
    </section>
  );
}, FormError);

export const DeleteDashboardButton = withFormErrorBoundary<{ name: string }>(function ({ name, errorChildren }) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      className="inline-flex text-red-600"
      onClick={() => startTransition(() => deleteDashboardAction(name))}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
      {errorChildren}
    </button>
  );
}, FormError);

function FormStatus () {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && <div className="bg-blue-200 text-blue-600">Adding...</div>}
    </>
  );
}

function Input (props: InputHTMLAttributes<HTMLInputElement>) {
  const { pending, data } = useFormStatus();

  return (
    <input {...props} disabled={props.disabled || pending} />
  );
}

function Button (props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button {...props} disabled={props.disabled || pending} />
  );
}
