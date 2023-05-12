import { MenuItemProps } from './types.ts';
import { useBinding } from '../../hooks/binding';
import { useContext, useEffect } from 'react';
import { MenuContext } from './Menu.tsx';

export function MenuItem (props: MenuItemProps) {
  const { name } = useContext(MenuContext);
  const [, setValue] = useBinding(`menu.${name}`, props.id, props);

  useEffect(() => {
    setValue(props);
  }, [props.id, props.text, props.group, props.order, props.extraText, props.disabled, specialKey(props)]);

  return <></>;
}

const specialKey = (item: MenuItemProps) => {
  if ('children' in item) {
    return JSON.stringify(item.children);
  } else {
    return item.action.toString();
  }
};
