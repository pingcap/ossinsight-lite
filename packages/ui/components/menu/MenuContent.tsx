import { useBindingValues } from '../../hooks/binding/hooks.ts';
import { forwardRef, MenuHTMLAttributes, ReactElement, useMemo } from 'react';
import { MenuActionItemProps, MenuItemGroupProps, MenuParentItemProps, SubMenuItemProps } from './types.ts';

export interface MenuContentProps extends Omit<MenuHTMLAttributes<HTMLMenuElement>, 'children'> {

  name: string;

  renderGroup (group: Omit<MenuItemGroupProps, 'items'>, children: ReactElement[]): ReactElement[];

  renderSeparator (previousIndex: number, previousGroup: MenuItemGroupProps, nextGroup: MenuItemGroupProps): ReactElement;

  renderParentItem (parent: Omit<MenuParentItemProps, 'children'>, children: ReactElement[]): ReactElement;

  renderItem (item: MenuActionItemProps, subMenu: false): ReactElement;

  renderItem (item: SubMenuItemProps, subMenu: true): ReactElement;

  renderItem (item: MenuActionItemProps | SubMenuItemProps, subMenu: boolean): ReactElement;
}

export const MenuContent = forwardRef<HTMLMenuElement, MenuContentProps>(function MenuContent ({ name, renderGroup, renderItem, renderParentItem, renderSeparator, ...props }: MenuContentProps, ref) {
  const values = useBindingValues(`menu.${name}`);

  const groups = useMemo(() => {
    const groups: MenuItemGroupProps[] = [];
    Object.values(values).forEach((item) => {
      const group = groups[item.group] = groups[item.group] || { items: [] };

      // find a blank place
      let order = item.order;
      while (group.items[order]) {
        order++;
      }

      group.items[order] = item;
    });
    return groups.map(normalizeGroup);
  }, []);

  const children: ReactElement[] = [];

  groups.forEach((group, index) => {
    if (index > 0) {
      children.push(renderSeparator(index - 1, groups[index - 1], group));
    }
    children.push(...renderGroup(group, group.items.map(item => (
      'children' in item
        ? renderParentItem(item, item.children.map(
          subItem => renderItem(subItem, true),
        ))
        : renderItem(item, false)
    ))));
  });

  return (
    <menu {...props} ref={ref}>
      {children}
    </menu>
  );
});

function normalizeGroup ({ items, ...rest }: MenuItemGroupProps): MenuItemGroupProps {
  return {
    items: normalizeArrays(items),
    ...rest,
  };
}

function normalizeArrays<T> (arr: T[]) {
  const keys: number[] = [];
  for (const key in arr) {
    keys.push(parseInt(key));
  }
  return keys.sort().map(i => arr[i]);
}
