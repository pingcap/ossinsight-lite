'use client';
import { createContext, ReactNode } from 'react';
import { MenuRenderers } from './MenuContent';

export interface MenuProps {
  children?: ReactNode;
}

export function Menu ({ renderers, children }: MenuProps & { renderers: MenuRenderers }) {
  return (
    <MenuContext.Provider value={{ renderers }}>
      {children}
    </MenuContext.Provider>
  );
}

export interface MenuContextValues {
  renderers: MenuRenderers;
}

export const MenuContext = createContext<MenuContextValues>({
  renderers: {
    renderSeparator: () => { throw new Error('not impl'); },
    renderItem: () => { throw new Error('not impl'); },
    renderLinkItem: () => { throw new Error('not impl'); },
    renderParentItem: () => { throw new Error('not impl'); },
    renderCustomItem: () => { throw new Error('not impl'); },
  },
});

export interface MenuDirectItemsContext {
  direct: boolean;
}

MenuContext.displayName = 'X-MenuContext';
