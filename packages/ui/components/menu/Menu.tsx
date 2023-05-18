'use client';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { MenuItemProps } from './types';
import { useReactBindCollections } from '../../hooks/bind';

export interface MenuProps {
  name: string;
  auto?: boolean;
  children?: ReactNode;
}

export type MenuKey<K extends string> = `menu.${K}`;

declare module '../../hooks/bind' {
  interface CollectionsBindMap extends Record<MenuKey<string>, MenuItemProps> {
  }
}

export function Menu ({ name, auto = true, children }: MenuProps) {
  const parentContext = useContext(MenuContext);
  if (!name) {
    throw new Error('Menu name is nullish');
  }
  if (auto) {
    return (
      <MenuContext.Provider value={{ name, parentId: undefined }}>
        <Registry name={name} />
        {children}
      </MenuContext.Provider>
    );
  }
  if (parentContext.name === '') {
    throw new Error('Auto <Menu /> must has non-auto <Menu /> ancestor');
  }
  return <>{children}</>;
}

function Registry ({ name }: { name: string }) {
  const collections = useReactBindCollections();

  useEffect(() => {
    collections.add(`menu.${name}`);
    return () => {
      collections.del(`menu.${name}`);
    };
  }, []);

  return null;
}

export const MenuContext = createContext<{ name: string, parentId: string | undefined }>({
  name: '',
  parentId: undefined,
});

MenuContext.displayName = 'X-MenuContext';
