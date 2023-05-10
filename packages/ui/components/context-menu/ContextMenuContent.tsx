import { useContextMenuContext } from './context.tsx';

import * as RuiContextMenu from '@radix-ui/react-context-menu';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { MenuActionItemProps, MenuParentItemProps } from './types.ts';
import { ReactElement } from 'react';
import { stopPropagation } from './common.ts';

const separatorClasses = 'border-b';

export default function ContextMenuContent () {
  const { groups } = useContextMenuContext();

  const list = groups.flatMap((group, groupIndex) => {
    const arr: ReactElement[] = [];
    if (groupIndex > 0) {
      arr.push(<RuiContextMenu.Separator className={separatorClasses} key={`group-${groupIndex}-separator`} />);
    }
    arr.push(...group.items.map(item => (
      ('children' in item)
        ? <ParentItem key={item.key} {...item} />
        : <ActionItem key={item.key} {...item} />
    )));
    return arr;
  });

  return <>{list}</>;
}

function ActionItem (item: Omit<MenuActionItemProps, 'group' | 'order' | 'key'>) {
  return (
    <RuiContextMenu.Item
      className="min-w-[112px] outline-none bg-transparent hover:bg-gray-50 transition:colors p-1 cursor-pointer flex justify-between items-center"
      onClick={item.action}
      disabled={item.disabled}
    >
      {item.text}
      <span>
        {item.extraText}
      </span>
    </RuiContextMenu.Item>
  );
}

function ParentItem (item: Omit<MenuParentItemProps, 'key'>) {
  return (
    <RuiContextMenu.Sub>
      <RuiContextMenu.SubTrigger
        className="min-w-[112px] outline-none flex justify-between items-center"
        disabled={item.disabled}
      >
        {item.text}
        <span className="text-gray-400">
          <ChevronRightIcon />
        </span>
      </RuiContextMenu.SubTrigger>
      <RuiContextMenu.Portal>
        <RuiContextMenu.SubContent className="bg-white z-50 rounded shadow p-2" onMouseDown={stopPropagation}>
          {item.children.map(subItem => (
            <ActionItem key={subItem.key} {...subItem} />
          ))}
        </RuiContextMenu.SubContent>
      </RuiContextMenu.Portal>
    </RuiContextMenu.Sub>
  );
}

