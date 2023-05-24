import { useContext, useEffect } from 'react';
import clientOnly from '../../../../src/utils/clientOnly';
import { collections } from '../../hooks/bind';
import { useSafeUpdater, useWhenReady } from '../../hooks/bind/hooks.ts';
import { withSuspense } from '../../utils/suspense';
import { MenuContext, MenuDirectItemsContext, MenuKey } from './Menu';
import { renderAny } from './MenuContent.tsx';
import { isActionItem, isCustomItem, isParentItem, MenuItemProps } from './types';

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
  const { direct } = useContext(MenuDirectItemsContext);
  const { name, parentId, renderers } = useContext(MenuContext);

  if (direct) {
    return renderAny(props, renderers);
  }

  const collectionKey = computeCollectionKey(name, parentId);
  const updater = useSafeUpdater(collectionKey, props.id);
  const isParent = isParentItem(props);

  useWhenReady(collections, collectionKey, (menuCollection, sub) => {
    const parentKey: MenuKey<string> = `${collectionKey}.${props.id}`;
    if (isParent) {
      collections.add(parentKey);
    }
    menuCollection.add(props.id, props);

    sub.add(() => {
      menuCollection.del(props.id);
    });

    if (isParent) {
      collections.del(parentKey);
    }
  }, [name, props.id, isParent]);

  useEffect(() => {
    updater(props);
  }, [name, updater, props.id, props.text, props.order, props.disabled, specialKey(props)]);

  if (isParentItem(props)) {
    return (
      <MenuContext.Provider value={{ name, parentId: computeParentId(props.id, parentId), renderers }}>
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
