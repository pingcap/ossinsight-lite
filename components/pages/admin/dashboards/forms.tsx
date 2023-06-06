'use client';
import { addDashboardAction, deleteDashboardAction, toggleDashboardVisibilityAction } from '@/actions/widgets';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import EyeSlashIcon from 'bootstrap-icons/icons/eye-slash.svg';
import EyeIcon from 'bootstrap-icons/icons/eye.svg';
import TrashIcon from 'bootstrap-icons/icons/trash.svg';
import { useTransition } from 'react';

export const AddDashboardForm = function NewTrackingRepoForm () {
  return (
    <section className="mt-4">
      <h2>Create new dashboard</h2>
      <ServerActionForm action={addDashboardAction}>
        <ActionStateAlerts
          success={{ title: 'New dashboard created' }}
          pending={{ title: 'Creating dashboard', message: 'Please don\'t leave this page.' }}
        />
        <FormControl label="Dashboard name" name="name">
          <Input name="name" />
        </FormControl>
        <div className="form-control">
          <Button type="submit">Create Dashboard</Button>
        </div>
      </ServerActionForm>
    </section>
  );
};

export const DeleteDashboardButton = function ({ name }: { name: string }) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      className="btn btn-red"
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
    <button
      className="btn btn-link"
      onClick={() => startTransition(() => toggleDashboardVisibilityAction(name, visibility))}
      disabled={isPending}
    >
      {isPending ? <LoadingIndicator /> : isPrivate ? <EyeSlashIcon /> : <EyeIcon className="text-green-500" />}
    </button>
  );
};
