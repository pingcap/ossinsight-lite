import * as RuiContextMenu from '@radix-ui/react-context-menu';
import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { ContextMenuContextProvider, useContextMenuContext } from './context.tsx';
import ContextMenuContent from './ContextMenuContent.tsx';
import { stopPropagation } from './common.ts';

export interface ContextMenuProps {
  trigger: ReactElement;
  children?: ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({ trigger, children }: ContextMenuProps) => {
  return (
    <ContextMenuContextProvider>
      <ContextMenuRoot>
        {trigger}
      </ContextMenuRoot>
      {children}
    </ContextMenuContextProvider>
  );
};

function ContextMenuRoot ({ children }: PropsWithChildren) {
  const { groups } = useContextMenuContext();

  return (
    <RuiContextMenu.Root>
      <RuiContextMenu.Trigger asChild disabled={groups.length === 0}>
        {children}
      </RuiContextMenu.Trigger>
      <RuiContextMenu.Portal>
        <RuiContextMenu.Content
          className="bg-white rounded pointer-events-none shadow p-2 z-40 text-sm flex flex-col gap-2"
          onMouseDown={stopPropagation}
        >
          <ContextMenuContent />
        </RuiContextMenu.Content>
      </RuiContextMenu.Portal>
    </RuiContextMenu.Root>
  );
}
