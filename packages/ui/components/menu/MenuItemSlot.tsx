import { ReactNode, useContext } from 'react';
import { MenuContext } from './Menu.tsx';

export interface MenuItemSlotProps {
  id: string;
  children: ReactNode;
}

export function MenuItemSlot ({ id, children }: MenuItemSlotProps) {
  const { name } = useContext(MenuContext);

  return <MenuContext.Provider value={{ name, parentId: id }}>{children}</MenuContext.Provider>;
}