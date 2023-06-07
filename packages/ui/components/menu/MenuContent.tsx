'use client';
import { ReactElement, ReactNode } from 'react';
import { isActionItem, isCustomItem, isLinkItem, isSeparatorItem, MenuActionItemProps, MenuCustomItemProps, MenuItemProps, MenuLinkItemProps, MenuParentItemProps, MenuSeparatorItemProps } from './types';

export interface MenuRenderers {

  renderSeparator (item: MenuSeparatorItemProps): ReactElement;

  renderParentItem (parent: Omit<MenuParentItemProps, 'children'>, isSub: boolean, children: ReactNode): ReactElement;

  renderCustomItem (custom: MenuCustomItemProps): ReactElement;

  renderLinkItem (link: MenuLinkItemProps): ReactElement;

  renderItem (item: MenuActionItemProps): ReactElement;
}

export interface DirectItemsProps {
  items?: ReactNode;
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
