import { isActionItem, isCustomItem, isParentItem, MenuItemProps } from './types';
import { useContext, useEffect } from 'react';
import { MenuContext, MenuKey } from './Menu';
import { withSuspense } from '../../utils/suspense';
import { collection, collections, useUpdater } from '../../hooks/bind';
import clientOnly from '../../../../src/utils/clientOnly';

function computeCollectionKey (name: string, parentId: string | undefined): MenuKey<string> {
  if (parentId) {
    return `menu.${name}.${parentId}`;
  } else {
    return `menu.${name}`;
  }
}

function computeParentId (id: string, parentId: string | undefined): string {
  if (parentId) {
    return `${parentId}.${id}`;
  } else {
    return id;
  }
}

export const MenuItem = clientOnly(withSuspense(function MenuItem (props: MenuItemProps) {
  const { name, parentId } = useContext(MenuContext);
  const collectionKey = computeCollectionKey(name, parentId);
  const menuCollection = collection(collectionKey);
  const updater = useUpdater(collectionKey, props.id);

  const isParent = isParentItem(props);

  useEffect(() => {
    const parentKey: MenuKey<string> = `${collectionKey}.${props.id}`;
    if (isParent) {
      collections.add(parentKey);
    }
    menuCollection.add(props.id, props);

    return () => {
      menuCollection.del(props.id);
      if (isParent) {
        collections.del(parentKey);
      }
    };
  }, [name, props.id, isParent]);

  useEffect(() => {
    updater(props);
  }, [name, updater, props.id, props.text, props.order, props.disabled, specialKey(props)]);

  if (isParentItem(props)) {
    return (
      <MenuContext.Provider value={{ name, parentId: computeParentId(props.id, parentId) }}>
        {props.children}
      </MenuContext.Provider>
    );
  } else {
    return null;
  }
}));

const specialKey = (item: MenuItemProps) => {
  if (isCustomItem(item)) {
    return item.children;
  } else if (isActionItem(item)) {
    return item.action;
  } else if (isParentItem(item)) {
    return item.children;
  } else {
    return 'separator';
  }
};
