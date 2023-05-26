import { ServerActionFormState } from '@/components/ServerActionForm/type';
import { createContext } from 'react';

export const ServerActionFormContext = createContext<{
  state: ServerActionFormState,
  error: Error | undefined
}>({
  state: ServerActionFormState.RESET,
  error: undefined,
});
