import * as RuiContextMenu from '@radix-ui/react-context-menu';
import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { stopPropagation } from './common.ts';
import { Menu } from '../menu/Menu.tsx';
import { renderGroup, renderItem, renderParentItem, renderSeparator } from './content.tsx';
import { useBindingNames } from '../../hooks/binding/hooks.ts';
import { MenuContent } from '../menu';

export interface ContextMenuProps {
  name: string;
  trigger: ReactElement;
  children?: ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({ name, trigger, children }: ContextMenuProps) => {
  return (
    <Menu name={name}>
      <ContextMenuRoot name={name}>
        {trigger}
      </ContextMenuRoot>
      {children}
    </Menu>
  );
};

function ContextMenuRoot ({ name, children }: PropsWithChildren<{ name: string }>) {
  const names = useBindingNames(`menu.${name}`);

  return (
    <RuiContextMenu.Root>
      <RuiContextMenu.Trigger asChild disabled={names.length === 0}>
        {children}
      </RuiContextMenu.Trigger>
      <RuiContextMenu.Portal>
        <RuiContextMenu.Content
          className="bg-white rounded pointer-events-none shadow p-2 z-40 text-sm flex flex-col gap-2"
          onMouseDown={stopPropagation}
        >
          <MenuContent
            key="menu"
            name={name}
            renderGroup={renderGroup}
            renderSeparator={renderSeparator}
            renderParentItem={renderParentItem}
            renderItem={renderItem} />
        </RuiContextMenu.Content>
      </RuiContextMenu.Portal>
    </RuiContextMenu.Root>
  );
}
