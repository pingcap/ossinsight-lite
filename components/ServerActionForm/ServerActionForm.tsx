import { ServerActionFormContext } from '@/components/ServerActionForm/context';
import { ServerActionFormState } from '@/components/ServerActionForm/type';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import clsx from 'clsx';
import { isNextRouterError } from 'next/dist/client/components/is-next-router-error';
import { FormHTMLAttributes, useState, useTransition } from 'react';

interface ServerActionFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'action'> {
  action: (formData: FormData) => Promise<void>;
}

export function ServerActionForm ({ action, ...props }: ServerActionFormProps) {
  const [state, setState] = useState(ServerActionFormState.RESET);
  const [error, setError] = useState<Error>();
  const [, startTransition] = useTransition();

  const internalAction = useRefCallback(async (formData: FormData) => {
    setError(undefined);
    setState(ServerActionFormState.PENDING);
    await startTransition(async () => {
      try {
        await action(formData);
        setState(ServerActionFormState.SUCCEED);
      } catch (e: any) {
        if (isNextRouterError(e)) {
          throw e;
        }
        setState(ServerActionFormState.ERROR);
        setError(e);
      }
    });
  });

  return (
    <ServerActionFormContext.Provider
      value={{
        state,
        error,
      }}
    >
      <form action={internalAction} {...props} className={clsx('server-form', props.className)} />
    </ServerActionFormContext.Provider>
  );
}