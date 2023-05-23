import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { ReactElement, useContext } from 'react';
import { ServerActionFormContext } from '@/src/components/ServerActionForm/context';

interface ActionPendingProps {
  children: ReactElement | null;
}

export function ActionPending ({ children }: ActionPendingProps) {
  const { pending } = useFormStatus();
  return pending ? children : null;
}