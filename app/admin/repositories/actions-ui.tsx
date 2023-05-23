'use client';
import { addTrackingRepoAction, deleteTrackingRepoAction } from '@/app/admin/repositories/actions';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import { withFormErrorBoundary } from '@/src/utils/form';
import { useTransition } from 'react';
import { ActionError, ActionPending, ActionSucceed, Button, FormControl, Input, ServerActionForm } from '@/src/components/ServerActionForm';
import { Alert } from '@/src/components/Alert';

export const FormError: ErrorComponent = ({ error }) => {
  return (
    <div className="p-2 text-red-600 bg-red-200">
      {error.message}
    </div>
  );
};

export const NewTrackingRepoForm = withFormErrorBoundary(function NewTrackingRepoForm ({ errorChildren, reset }) {
  return (
    <section className="mt-4">
      <h2>Add new tracking repo</h2>
      <ServerActionForm action={addTrackingRepoAction}>
        <ActionError />
        <ActionSucceed>
          <Alert type="success" title="New repo added." />
        </ActionSucceed>
        <ActionPending>
          <Alert type="warning" title="Adding repo..." message="Please do not leave this page." />
        </ActionPending>
        <FormControl label="Repo name" name="repo_name">
          <Input />
        </FormControl>
        <div className="form-control">
          <Button type="submit">Add repo</Button>
        </div>
      </ServerActionForm>
    </section>
  );
}, FormError);

export const DeleteActionButton = function ({ repoName }: { repoName: string }) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      className="inline-flex text-red-600"
      onClick={() => startTransition(() => deleteTrackingRepoAction(repoName))}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
};
