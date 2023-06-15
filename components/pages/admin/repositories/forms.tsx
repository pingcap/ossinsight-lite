'use client';
import { addTrackingRepoAction, deleteTrackingRepoAction } from '@/actions/pipeline';
import { RemoteRepositoriesList } from '@/components/pages/admin/repositories/RemoteRepositoriesList';
import { ActionError, ActionState, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';
import LoadingIndicator from '@/packages/ui/components/loading-indicator';
import TrashIcon from 'bootstrap-icons/icons/trash.svg';
import { useCallback, useState, useTransition } from 'react';

export const NewTrackingRepoForm = function NewTrackingRepoForm ({ selectedNames }: { selectedNames: string[] }) {
  const [clearVersion, setClearVersion] = useState(0);
  const handleActionSucceed = useCallback(() => {
    setClearVersion(v => v + 1);
  }, []);

  return (
    <ServerActionForm action={addTrackingRepoAction} className="w-full" onActionSuccess={handleActionSucceed}>
      <ActionError />
      <div className="flex w-full items-center gap-2 mt-2">
        <FormControl name="repo_name" className="rounded-full border py-2 px-4 bg-white flex-1">
          <RemoteRepositoriesList selectedNames={selectedNames} clearVersion={clearVersion}>
            <Input className="text-input-borderless w-full" placeholder="Search repos" autoComplete="off" />
          </RemoteRepositoriesList>
        </FormControl>
        <ActionState>
          {(pending, state, error) => (
            <button type="submit" disabled={pending} className="btn btn-primary flex items-center gap-2">
              {pending ? <><span>Adding...</span><LoadingIndicator /></> : 'Add repo'}
            </button>
          )}
        </ActionState>
      </div>
    </ServerActionForm>
  );
};

export const DeleteActionButton = function ({ repoName, onClick }: { repoName: string, onClick: () => void }) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      className="btn btn-link btn-red"
      onClick={() => {
        onClick();
        startTransition(() => deleteTrackingRepoAction(repoName));
      }}
      disabled={isPending}
    >
      {isPending ? <LoadingIndicator /> : <TrashIcon />}
    </button>
  );
};
