import { Alert } from '@/components/Alert';
import { ServerActionFormContext } from '@/components/ServerActionForm/context';
import { ReactElement, useContext } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

interface ActionErrorProps {
  children?: (error: Error | undefined) => ReactElement | null;
}

export function ActionError ({ children = defaultAlert }: ActionErrorProps) {
  const { pending } = useFormStatus();
  const { error } = useContext(ServerActionFormContext);
  return !pending && error ? children(error) : null;
}

const defaultAlert: Exclude<ActionErrorProps['children'], undefined> = error => error ? (
  <Alert type="error" title={error.name} message={error.message} />
) : null;