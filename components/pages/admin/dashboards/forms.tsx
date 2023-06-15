'use client';
import { addDashboardAction, deleteDashboardAction, toggleDashboardVisibilityAction } from '@/actions/widgets';
import { ActionState, ActionStateAlerts, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';
import Tooltip from '@/components/Tooltip';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import EyeSlashIcon from 'bootstrap-icons/icons/eye-slash.svg';
import EyeIcon from 'bootstrap-icons/icons/eye.svg';
import PlusIcon from 'bootstrap-icons/icons/plus.svg';
import TrashIcon from 'bootstrap-icons/icons/trash.svg';
import { useTransition } from 'react';

export const AddDashboardForm = function NewTrackingRepoForm () {
  return (
    <ServerActionForm action={addDashboardAction} className="in-list flex items-center justify-between gap-2 column w-full">
      <FormControl name="name">
        <Input name="name" className="text-input-borderless" placeholder="New dashboard" minLength={1} />
      </FormControl>
      <div className="form-control">
        <ActionState>
          {(pending) => (
            <button className="btn btn-link" type="submit" disabled={pending}>
              {pending ? <LoadingIndicator /> : <PlusIcon width={18} height={18} />}
            </button>
          )}
        </ActionState>
      </div>
    </ServerActionForm>
  );
};

export const DeleteDashboardButton = function ({ name }: { name: string }) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      className="btn btn-sm btn-link btn-red"
      onClick={() => startTransition(() => deleteDashboardAction(name))}
      disabled={isPending}
    >
      {isPending ? <LoadingIndicator /> : <TrashIcon />}
    </button>
  );
};

export const ChangeVisibleButton = function ({ name, visibility }: { name: string, visibility: 'public' | 'private' }) {
  let [isPending, startTransition] = useTransition();
  const isPrivate = visibility !== 'public';

  return (
    <Tooltip label="Change visibility">
      <button
        className="btn btn-sm btn-link"
        onClick={() => startTransition(() => toggleDashboardVisibilityAction(name, visibility))}
        disabled={isPending}
      >
        {isPending ? <LoadingIndicator /> : isPrivate ? <EyeSlashIcon /> : <EyeIcon className="text-green-500" />}
      </button>
    </Tooltip>
  );
};
