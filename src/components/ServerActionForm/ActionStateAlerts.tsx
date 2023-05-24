import { ActionError } from '@/src/components/ServerActionForm/ActionError';
import { ActionSucceed } from '@/src/components/ServerActionForm/ActionSucceed';
import { Alert } from '@/src/components/Alert';
import { ActionPending } from '@/src/components/ServerActionForm/ActionPending';
import { ReactNode } from 'react';

export interface ActionStateProps {
  pending?: {
    title?: ReactNode
    message?: ReactNode
  };
  success?: {
    title?: ReactNode
    message?: ReactNode
  };
}

export function ActionStateAlerts ({ success, pending }: ActionStateProps) {
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