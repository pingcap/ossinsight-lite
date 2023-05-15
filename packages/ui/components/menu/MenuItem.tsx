import { MenuItemProps } from './types.ts';
import { useContext, useEffect } from 'react';
import { MenuContext } from './Menu.tsx';
import { withSuspense } from '../../utils/suspense.tsx';
import { useCollection, useUpdater } from '../../hooks/bind';

export const MenuItem = withSuspense(function MenuItem (props: MenuItemProps) {
  const { name } = useContext(MenuContext);
  const collection = useCollection(`menu.${name}`);
  const updater = useUpdater(`menu.${name}`, props.id);

  let justAdded: boolean = false;

  useEffect(() => {
    collection.add(props.id, props);
    justAdded = true;
    return () => collection.del(props.id);
  }, [name, props.id]);

  useEffect(() => {
    if (justAdded) {
      updater(props);
    }
  }, [name, props.id, props.text, props.group, props.order, props.extraText, props.disabled, specialKey(props)]);

  return <></>;
});

const specialKey = (item: MenuItemProps) => {
  if ('children' in item) {
    return JSON.stringify(item.children);
  } else {
    return item.action.toString();
  }
};
