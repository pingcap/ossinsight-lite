'use client';
import { collection, useCollectionKeys, useWatchItem } from '../../hooks/bind';
import { ReactElement, ReactNode } from 'react';
import { isActionItem, isCustomItem, isSeparatorItem, MenuActionItemProps, MenuCustomItemProps, MenuParentItemProps, MenuSeparatorItemProps } from './types';
import { KeyType } from '../../hooks/bind/types';
import { MenuKey } from './Menu';
import clientOnly from '../../../../src/utils/clientOnly';

export interface MenuContentProps {

  name: string;

  renderSeparator (item: MenuSeparatorItemProps): ReactElement;

  renderParentItem (parent: Omit<MenuParentItemProps, 'children'>, isSub: boolean, children: ReactNode): ReactElement;

  renderCustomItem (custom: MenuCustomItemProps): ReactElement;

  renderItem (item: MenuActionItemProps): ReactElement;
}

export const MenuContent = clientOnly(function (menu: MenuContentProps) {
  const menuCollection = collection(`menu.${menu.name}`);
  const ids = useCollectionKeys(menuCollection);

  return (
    <>
      {ids.map((id) => <RenderAny key={String(id)} id={id} menuKey={`menu.${menu.name}`} isRoot menu={menu} />)}
    </>
  );
})

interface RenderProps {
  id: KeyType,
  menuKey: MenuKey<string>,
  menu: MenuContentProps
  isRoot?: boolean
}

export function RenderAny ({ id, menuKey, menu, isRoot = false }: RenderProps) {
  const item = useWatchItem(menuKey, id);

  if (isCustomItem(item)) {
    return renderCustom(item, menu);
  } else if (isActionItem(item)) {
    return renderAction(item, menu);
  } else if (isSeparatorItem(item)) {
    return menu.renderSeparator(item);
  } else {
    return <RenderParent props={item} menu={menu} menuKey={menuKey} isRoot={isRoot} />;
  }
}

function RenderParent ({ menu, menuKey, props, isRoot }: { menuKey: MenuKey<string>, props: MenuParentItemProps, menu: MenuContentProps, isRoot: boolean }) {
  menuKey = `${String(menuKey)}.${props.id}` as MenuKey<string>;
  const keys = useCollectionKeys(collection(menuKey));

  return menu.renderParentItem(props, !isRoot, (
    <>{keys.map(key => <RenderAny id={key} key={String(key)} menuKey={menuKey} menu={menu} />)}</>
  ));
}

function renderCustom (item: MenuCustomItemProps, menu: MenuContentProps) {
  return menu.renderCustomItem(item);
}

function renderAction (item: MenuActionItemProps, menu: MenuContentProps) {
  return menu.renderItem(item);
}
