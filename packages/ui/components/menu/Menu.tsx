'use client';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { collections } from '../../hooks/bind';
import { MenuRenderers } from './MenuContent';
import { MenuItemProps } from './types';

export interface MenuProps {
  name: string;
  auto?: boolean;
  simple?: boolean;
  children?: ReactNode;
}

export type MenuKey<K extends string> = `menu.${K}`;

declare module '../../hooks/bind' {
  interface CollectionsBindMap extends Record<MenuKey<string>, MenuItemProps> {
  }
}

export function Menu ({ name, auto = true, simple = false, renderers, children }: MenuProps & { renderers?: MenuRenderers }) {
  if (simple) {
    return <MenuContext.Provider value={{ name, parentId: undefined, renderers }}>{children}</MenuContext.Provider>;
  }
  const parentContext = useContext(MenuContext);
  if (!name) {
    throw new Error('Menu name is nullish');
  }
  if (auto) {
    return (
      <MenuContext.Provider value={{ name, parentId: undefined, renderers }}>
        <Registry name={name} />
        {children}
      </MenuContext.Provider>
    );
  }
  if (parentContext.name === '') {
    throw new Error('Non-Auto <Menu /> must has auto <Menu /> ancestor');
  }
  parentContext.renderers = renderers;
  return <>{children}</>;
}

function Registry ({ name }: { name: string }) {
  useEffect(() => {
    collections.add(`menu.${name}`);
    return () => {
      collections.del(`menu.${name}`);
    };
  }, []);

  return null;
}

export interface MenuContextValues {
  name: string;
  parentId: string | undefined;
  renderers: MenuRenderers | undefined;
}

export const MenuContext = createContext<MenuContextValues>({
  name: '',
  parentId: undefined,
  renderers: undefined,
});

export interface MenuDirectItemsContext {
  direct: boolean;
}

export const MenuDirectItemsContext = createContext<MenuDirectItemsContext>({
  direct: false,
});

MenuContext.displayName = 'X-MenuContext';
