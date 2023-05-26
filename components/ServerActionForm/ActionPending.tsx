import { ReactElement } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

interface ActionPendingProps {
  children: ReactElement | null;
}

export function ActionPending ({ children }: ActionPendingProps) {
  const { pending } = useFormStatus();
  return pending ? children : null;
}