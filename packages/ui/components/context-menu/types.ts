import { ReactNode } from 'react';

type BaseItemProps = {
  key: string
  group: number
  order: number
  text: ReactNode
  extraText?: ReactNode
  disabled: boolean
}

export type ActionSpecialProps = { action: () => void; };
export type ParentSpecialProps = { children: SubMenuItemProps[] };

export type MenuActionItemProps = BaseItemProps & ActionSpecialProps;
export type MenuParentItemProps = BaseItemProps & ParentSpecialProps;
export type MenuItemProps = MenuActionItemProps | MenuParentItemProps;

export type SubMenuItemProps = {
  key: string
  text: ReactNode
  extraText?: ReactNode
  disabled: boolean
  action: () => void;
}

export type MenuItemGroupProps = {
  items: MenuItemProps[]
}

