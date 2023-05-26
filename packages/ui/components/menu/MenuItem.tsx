'use client';
import { useContext } from 'react';
import { MenuContext } from './Menu';
import { renderAny } from './MenuContent';
import { MenuItemProps } from './types';

export function MenuItem (props: MenuItemProps) {
  const { renderers } = useContext(MenuContext);

  return renderAny(props, renderers);
}