import { ActionSpecialProps, MenuItemGroupProps, MenuItemProps, ParentSpecialProps } from './types.ts';
import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';

export type RegisterMenuItemOptions = Partial<Omit<MenuItemProps, 'key'>> & Pick<MenuItemProps, 'text'> & (ActionSpecialProps | ParentSpecialProps)
export type UpdateMenuItemOptions = Partial<Omit<MenuItemProps, 'key'>>

export type ContextMenuContextValues = {
  groups: MenuItemGroupProps[]

  register (key: string, options: RegisterMenuItemOptions): void
  unregister (key: string): void
  update (key: string, options: UpdateMenuItemOptions): void
}

const ContextMenuContext = createContext<ContextMenuContextValues>({
  groups: [],
  register () {},
  unregister () {},
  update () {},
});

export function ContextMenuContextProvider ({ children }: PropsWithChildren) {
  const [groups, setGroups] = useState<MenuItemGroupProps[]>([]);

  const register = useCallback((key: string, { disabled, order, group, ...rest }: RegisterMenuItemOptions) => {
    const menuItem: MenuItemProps = {
      key,
      disabled: disabled ?? false,
      order: order ?? Number.MAX_SAFE_INTEGER,
      group: group ?? 0,
      ...rest,
    };

    if ('action' in rest) {
      Object.assign(menuItem, rest);
    }

    unregister(key);

    setGroups(([...groups]) => {
      const group = groups[menuItem.group] = groups[menuItem.group] ?? { items: [] };
      group.items.splice(menuItem.order, 0, menuItem);
      return groups;
    });
  }, []);

  const unregister = useCallback((key: string) => {
    setGroups((groups) => {
      return groups.map(group => {
        const i = group.items.findIndex(item => item.key === key);
        if (i !== -1) {
          group.items.splice(i, 1);
        }
        return group;
      });
    });
  }, []);

  const update = useCallback((key: string, options: UpdateMenuItemOptions) => {
    if ('group' in options) {
      throw new Error('change group not impl');
    }
    if ('order' in options) {
      throw new Error('change order not impl');
    }
    setGroups((groups) => {
      return groups.map(group => {
        const i = group.items.findIndex(item => item.key === key);
        if (i !== -1) {
          group.items[i] = { ...group.items[i], ...options };
          return group;
        }
        return group;
      });
    });
  }, []);

  const contextValues: ContextMenuContextValues = {
    groups,
    register,
    unregister,
    update,
  };

  return (
    <ContextMenuContext.Provider value={contextValues}>
      {children}
    </ContextMenuContext.Provider>
  );
}

export function useContextMenuContext () {
  return useContext(ContextMenuContext);
}
