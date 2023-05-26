'use client';
import { addDashboardAction, deleteDashboardAction } from '@/actions/widgets';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';
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
      className="inline-flex text-red-600"
      onClick={() => startTransition(() => deleteDashboardAction(name))}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
};
