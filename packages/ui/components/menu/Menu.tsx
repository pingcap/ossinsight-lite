import { createContext, ReactNode } from 'react';
import { MenuItemProps } from './types.ts';

export interface MenuProps {
  transparent?: boolean;
  name: string;
  children?: ReactNode;
}

export type MenuKey<K extends string> = `menu.${K}`;

declare module '../../hooks/binding/context.ts' {
  interface BindingMap extends Record<`menu.${string}`, MenuItemProps> {
  }
}

export function Menu ({ name, children }: MenuProps) {
  return (
    <MenuContext.Provider value={{ name }}>
      {children}
    </MenuContext.Provider>
  );
}

export const MenuContext = createContext({
  name: ''
})
