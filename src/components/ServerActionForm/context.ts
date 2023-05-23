import { createContext } from 'react';
import { ServerActionFormState } from '@/src/components/ServerActionForm/type';

export const ServerActionFormContext = createContext<{
  state: ServerActionFormState,
  error: Error | undefined
}>({
  state: ServerActionFormState.RESET,
  error: undefined,
});
