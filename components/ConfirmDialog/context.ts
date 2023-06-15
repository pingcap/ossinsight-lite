import { createContext, ReactElement, ReactNode, useContext } from 'react';

export type ConfirmAction = {
  title: ReactElement
  description: ReactElement
  confirmText?: ReactNode
  rejectText?: ReactNode
}

export interface ConfirmDialogContextValues {
  open: (action: ConfirmAction) => Promise<boolean>;
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextValues>({
  open () { return Promise.resolve(false); },
});

export function useConfirm () {
  const { open } = useContext(ConfirmDialogContext);

  return open;
}
