import { isActionItem, isCustomItem, isParentItem, MenuItemProps } from './types.ts';
import { useContext, useEffect } from 'react';
import { MenuContext, MenuKey } from './Menu.tsx';
import { withSuspense } from '../../utils/suspense.tsx';
import { useCollection, useReactBindCollections, useUpdater } from '../../hooks/bind';

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

export const MenuItem = withSuspense(function MenuItem (props: MenuItemProps) {
  const { name, parentId } = useContext(MenuContext);
  const collectionKey = computeCollectionKey(name, parentId);
  const collection = useCollection(collectionKey);
  const collections = useReactBindCollections();
  const updater = useUpdater(collectionKey, props.id);

  const isParent = isParentItem(props);

  useEffect(() => {
    collection.add(props.id, props);
    const parentKey: MenuKey<string> = `${collectionKey}.${props.id}`;
    if (isParent) {
      collections.add(parentKey);
    }

    return () => {
      if (isParent) {
        collections.del(parentKey);
      }
      collection.del(props.id);
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
});

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
