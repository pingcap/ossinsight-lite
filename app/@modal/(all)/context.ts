import { createContext } from 'react';

export const ModalContext = createContext<{
  closeModal (): void
  useCompactMode (compact: boolean): void;
}>({
  closeModal () {},
  useCompactMode () {},
});
