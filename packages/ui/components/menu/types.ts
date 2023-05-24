import { ReactNode } from 'react';

type BaseItemProps = {
  id: string
  order: number
  text?: ReactNode
  disabled?: boolean
}

export type ActionSpecialProps = { action: () => void; };
export type LinkSpecialProps = {
  // TODO: type not save
  href: any
  as?: any
  replace?: boolean
  shallow?: boolean
  prefetch?: boolean
};
export type ParentSpecialProps = { parent: true, children: ReactNode };
export type CustomSpecialProps = { custom: true, children: ReactNode };
export type SeparatorSpecialProps = { separator: true };

export type MenuActionItemProps = BaseItemProps & ActionSpecialProps;
export type MenuLinkItemProps = BaseItemProps & LinkSpecialProps;
export type MenuCustomItemProps = BaseItemProps & CustomSpecialProps;
export type MenuParentItemProps = BaseItemProps & ParentSpecialProps;
export type MenuSeparatorItemProps = BaseItemProps & SeparatorSpecialProps;
export type MenuItemProps = MenuActionItemProps | MenuLinkItemProps | MenuParentItemProps | MenuCustomItemProps | MenuSeparatorItemProps;

export function isCustomItem (v: MenuItemProps): v is MenuCustomItemProps {
  return 'custom' in v && v.custom;
}

export function isActionItem (v: MenuItemProps): v is MenuActionItemProps {
  return 'action' in v;
}

export function isLinkItem (v: MenuItemProps): v is MenuLinkItemProps {
  return 'href' in v;
}

export function isSeparatorItem (v: MenuItemProps): v is MenuSeparatorItemProps {
  return 'separator' in v && v.separator;
}

export function isParentItem (v: MenuItemProps): v is MenuParentItemProps {
  return 'parent' in v && v.parent;
}
