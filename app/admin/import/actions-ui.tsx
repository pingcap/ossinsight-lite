'use client';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { withFormErrorBoundary } from '@/src/utils/form';
import { uploadLayoutJsonAction } from '@/app/admin/import/actions';
import { ButtonHTMLAttributes, InputHTMLAttributes, useState, useTransition } from 'react';

export const FormError: ErrorComponent = ({ error }) => {
  return (
    <div className="p-2 text-red-600 bg-red-200">
      {error.message}
    </div>
  );
};

export const ImportLayoutForm = withFormErrorBoundary(({ errorChildren }) => {
  const [transition, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  return (
    <section>
      {success && (
        <div className="bg-green-200 text-green-600 p-2 rounded">
          <h6 className="mb-2 text-lg font-bold">
            Upload success!
          </h6>
          <button className="bg-green-400 text-green-900 rounded px-2" onClick={() => location.reload()}>Refresh</button>
        </div>
      )}
      {transition && (
        <div className="bg-yellow-50 text-yellow-600 p-2 rounded">
          Uploading layout.json, please do not leave this page...
        </div>
      )}
      {errorChildren}
      <h2>Import layout.json</h2>
      <form
        action={(data) => startTransition(async () => {
          setSuccess(false);
          await uploadLayoutJsonAction(data);
          setSuccess(true);
        })}
      >
        <label>
          <Input name="layout.json" type="file" />
        </label>
        <Button>
          Import
        </Button>
      </form>
    </section>
  );
}, FormError);

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

function FormStatus () {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && <div className="bg-blue-200 text-blue-600">Uploading...</div>}
    </>
  );
}