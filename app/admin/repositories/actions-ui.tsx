'use client';
import { addTrackingRepoAction, deleteTrackingRepoAction } from '@/app/admin/repositories/actions';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import { useTransition } from 'react';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/src/components/ServerActionForm';

export const FormError: ErrorComponent = ({ error }) => {
  return (
    <div className="p-2 text-red-600 bg-red-200">
      {error.message}
    </div>
  );
};

export const NewTrackingRepoForm = function NewTrackingRepoForm ({}) {
  return (
    <section className="mt-4">
      <h2>Add new tracking repo</h2>
      <ServerActionForm action={addTrackingRepoAction}>
        <ActionStateAlerts
          success={{ title: 'New tracking repo added' }}
          pending={{ title: 'Adding tracking repo', message: 'Please don\'t leave this page.' }}
        />
        <FormControl label="Repo name" name="repo_name">
          <Input />
        </FormControl>
        <div className="form-control">
          <Button type="submit">Add repo</Button>
        </div>
      </ServerActionForm>
    </section>
  );
};

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
