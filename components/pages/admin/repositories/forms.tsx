'use client';
import { addTrackingRepoAction, deleteTrackingRepoAction } from '@/actions/pipeline';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';
import { useTransition } from 'react';

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
