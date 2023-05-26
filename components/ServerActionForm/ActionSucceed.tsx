import { ServerActionFormContext } from '@/components/ServerActionForm/context';
import { ServerActionFormState } from '@/components/ServerActionForm/type';
import { ReactElement, useContext } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

interface ActionSucceedProps {
  children: ReactElement | null;
}

export function ActionSucceed ({ children }: ActionSucceedProps) {
  const { pending } = useFormStatus();
  const { state } = useContext(ServerActionFormContext);
  return !pending && state === ServerActionFormState.SUCCEED ? children : null;
}