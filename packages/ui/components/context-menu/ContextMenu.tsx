import * as RuiContextMenu from '@radix-ui/react-context-menu';
import { FC, PropsWithChildren, ReactElement, Suspense } from 'react';
import { stopPropagation } from './common.ts';
import { Menu, MenuProps } from '../menu/Menu.tsx';
import * as renderers from './content.tsx';
import { MenuContent } from '../menu';
import { Consume } from '../../hooks/bind/types.ts';

export interface ContextMenuProps extends MenuProps {
  trigger: ReactElement;
  onOpenChange?: Consume<boolean>;
}

export const ContextMenu: FC<ContextMenuProps> = ({ name, auto, trigger, onOpenChange, children }: ContextMenuProps) => {
  return (
    <Menu name={name} auto={auto}>
      <ContextMenuRoot name={name} onOpenChange={onOpenChange}>
        {trigger}
      </ContextMenuRoot>
      <Suspense fallback="children loading">
        {children}
      </Suspense>
    </Menu>
  );
};

function ContextMenuRoot ({ name, onOpenChange, children }: PropsWithChildren<{ name: string, onOpenChange?: Consume<boolean> }>) {
  return (
    <RuiContextMenu.Root onOpenChange={onOpenChange}>
      <RuiContextMenu.Trigger asChild>
        {children}
      </RuiContextMenu.Trigger>
      <RuiContextMenu.Portal>
        <RuiContextMenu.Content
          className="bg-white rounded pointer-events-none shadow p-2 z-40 text-sm flex flex-col gap-2"
          onMouseDown={stopPropagation}
          hideWhenDetached
        >
          <menu>
            <MenuContent key="menu" name={name} {...renderers} />
          </menu>
        </RuiContextMenu.Content>
      </RuiContextMenu.Portal>
    </RuiContextMenu.Root>
  );
}
