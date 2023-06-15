import { Alert } from '@/components/Alert';
import { ActionError } from '@/components/ServerActionForm/ActionError';
import { ActionPending } from '@/components/ServerActionForm/ActionPending';
import { ActionSucceed } from '@/components/ServerActionForm/ActionSucceed';
import { ReactNode } from 'react';

export interface ActionStateAlertsProps {
  pending?: {
    title?: ReactNode
    message?: ReactNode
  };
  success?: {
    title?: ReactNode
    message?: ReactNode
  };
}

export function ActionStateAlerts ({ success, pending }: ActionStateAlertsProps) {
  return (
    <>
      <ActionError />
      {success && (
        <ActionSucceed>
          <Alert type="success" title={success.title} message={success.message} />
        </ActionSucceed>
      )}
      {pending && (
        <ActionPending>
          <Alert type="warning" title={pending.title} message={pending.message} />
        </ActionPending>
      )}
    </>
  );
}