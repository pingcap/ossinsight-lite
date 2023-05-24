'use client';
import { ReactElement, ReactNode, useContext } from 'react';
import clientOnly from '../../../../src/utils/clientOnly';
import { collection, useCollectionKeys, useWatchItem } from '../../hooks/bind';
import { KeyType } from '../../hooks/bind/types';
import { MenuContext, MenuDirectItemsContext, MenuKey } from './Menu';
import { isActionItem, isCustomItem, isLinkItem, isSeparatorItem, MenuActionItemProps, MenuCustomItemProps, MenuItemProps, MenuLinkItemProps, MenuParentItemProps, MenuSeparatorItemProps } from './types';

export interface MenuRenderers {

  renderSeparator (item: MenuSeparatorItemProps): ReactElement;

  renderParentItem (parent: Omit<MenuParentItemProps, 'children'>, isSub: boolean, children: ReactNode): ReactElement;

  renderCustomItem (custom: MenuCustomItemProps): ReactElement;

  renderLinkItem (link: MenuLinkItemProps): ReactElement;

  renderItem (item: MenuActionItemProps): ReactElement;
}

export interface MenuContentProps extends DirectItemsProps {
  name: string;
  simple: boolean;
}

export interface DirectItemsProps {
  items?: ReactNode;
}

export const MenuContent = clientOnly(function ({ items, simple, name }: MenuContentProps) {
  const { renderers } = useContext(MenuContext);
  if (simple) {
    return (
      <MenuDirectItemsContext.Provider value={{ direct: true }}>
        {items}
      </MenuDirectItemsContext.Provider>
    );
  }

  const menu = { ...renderers, simple, name };
  const menuCollection = collection(`menu.${menu.name}`);
  const ids = useCollectionKeys(menuCollection);

  return (
    <>
      <MenuDirectItemsContext.Provider value={{ direct: true }}>
        {items}
      </MenuDirectItemsContext.Provider>
      {ids.map((id) => <RenderAny key={String(id)} id={id} menuKey={`menu.${menu.name}`} isRoot menu={menu} renderers={renderers} />)}
    </>
  );
});

interface RenderProps {
  id: KeyType,
  menuKey: MenuKey<string>,
  menu: MenuContentProps
  isRoot?: boolean
  renderers: MenuRenderers
}

function RenderAny ({ id, menuKey, menu, isRoot = false, renderers }: RenderProps) {
  const item = useWatchItem(menuKey, id);

  if (isCustomItem(item)) {
    return renderers.renderCustomItem(item);
  } else if (isActionItem(item)) {
    return renderers.renderItem(item);
  } else if (isLinkItem(item)) {
    return renderers.renderLinkItem(item);
  } else if (isSeparatorItem(item)) {
    return renderers.renderSeparator(item);
  } else {
    return <RenderParent props={item} menu={menu} menuKey={menuKey} isRoot={isRoot} renderers={renderers} />;
  }
}

function RenderParent ({ menu, menuKey, props, isRoot, renderers }: { menuKey: MenuKey<string>, props: MenuParentItemProps, menu: MenuContentProps, isRoot: boolean, renderers: MenuRenderers }) {
  menuKey = `${String(menuKey)}.${props.id}` as MenuKey<string>;
  const keys = useCollectionKeys(collection(menuKey));

  return renderers.renderParentItem(props, !isRoot, (
    <>{keys.map(key => <RenderAny id={key} key={String(key)} menuKey={menuKey} menu={menu} renderers={renderers} />)}</>
  ));
}

export function renderAny (item: MenuItemProps, renderers: MenuRenderers) {
  if (isCustomItem(item)) {
    return renderers.renderCustomItem(item);
  } else if (isActionItem(item)) {
    return renderers.renderItem(item);
  } else if (isLinkItem(item)) {
    return renderers.renderLinkItem(item);
  } else if (isSeparatorItem(item)) {
    return renderers.renderSeparator(item);
  } else {
    return renderers.renderParentItem(item, false, item.children);
  }
}
