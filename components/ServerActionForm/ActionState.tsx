import { ServerActionFormContext } from '@/components/ServerActionForm/context';
import { ServerActionFormState } from '@/components/ServerActionForm/type';
import { ReactElement, useContext } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export interface ActionStateProps {
  children: (pending: boolean, state: ServerActionFormState, error: unknown) => ReactElement;
}

export function ActionState ({ children }: ActionStateProps) {
  const { pending } = useFormStatus();
  const { state, error } = useContext(ServerActionFormContext);

  return children(pending, state, error);
}
