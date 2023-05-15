import * as RuiToolbar from '@radix-ui/react-toolbar';
import { ToolbarProps } from '@radix-ui/react-toolbar';
import { MenuContent } from '../menu';
import { Suspense } from 'react';
import { Menu, MenuProps } from '../menu/Menu.tsx';
import * as renderers from './content.tsx';
import clsx from 'clsx';

export interface ToolbarMenuProps extends MenuProps, ToolbarProps {
}

export function ToolbarMenu ({ name, auto, children, ...props }: ToolbarMenuProps) {
  return (
    <Menu name={name} auto={auto}>
      <RuiToolbar.Root {...props} className={clsx('z-[1]', props.className)}>
        <Suspense fallback="menu loading">
          <MenuContent name={name} {...renderers} />
        </Suspense>
      </RuiToolbar.Root>
      <Suspense fallback="children loading">
        {children}
      </Suspense>
    </Menu>
  );
}
