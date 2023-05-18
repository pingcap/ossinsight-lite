import * as RuiContextMenu from '@radix-ui/react-context-menu';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { MenuContentProps } from '../menu';
import { stopPropagation } from './common';

const separatorClasses = 'border-b';

export const renderSeparator: MenuContentProps['renderSeparator'] = (previousIndex) => {
  return <RuiContextMenu.Separator className={separatorClasses} key={`group-${previousIndex}-separator`} />;
};

export const renderParentItem: MenuContentProps['renderParentItem'] = (item, _, children) => {
  return (
    <RuiContextMenu.Sub key={item.id}>
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
          {children}
        </RuiContextMenu.SubContent>
      </RuiContextMenu.Portal>
    </RuiContextMenu.Sub>
  );
};

export const renderItem: MenuContentProps['renderItem'] = (item) => {
  return (
    <RuiContextMenu.Item
      className="min-w-[112px] outline-none bg-transparent hover:bg-gray-50 transition:colors p-1 cursor-pointer flex justify-between items-center"
      onClick={item.action}
      disabled={item.disabled}
      key={item.id}
    >
      {item.text}
    </RuiContextMenu.Item>
  );
};

export const renderCustomItem: MenuContentProps['renderCustomItem'] = () => {
  throw new Error('ContextMenu does not support custom item.');
}
