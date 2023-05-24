import { createContext } from 'react';

export const ModalContext = createContext<{
  closeModal (): void
}>({
  closeModal () {},
});
