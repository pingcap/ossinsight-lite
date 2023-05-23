import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { ReactElement, useContext } from 'react';
import { ServerActionFormContext } from '@/src/components/ServerActionForm/context';
import { Alert } from '@/src/components/Alert';

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