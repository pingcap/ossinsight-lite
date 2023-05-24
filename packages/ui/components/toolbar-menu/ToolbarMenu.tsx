import * as RuiToolbar from '@radix-ui/react-toolbar';
import { ToolbarProps } from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import { Suspense } from 'react';
import { DirectItemsProps, MenuContent } from '../menu';
import { Menu, MenuProps } from '../menu/Menu';
import * as renderers from './content';

export interface ToolbarMenuProps extends MenuProps, ToolbarProps, DirectItemsProps {
}

export function ToolbarMenu ({ name, auto, children, items, simple, ...props }: ToolbarMenuProps) {
  return (
    <Menu name={name} auto={auto} renderers={renderers} simple={simple}>
      <RuiToolbar.Root
        {...props}
        className={clsx('z-[1]', props.className)}
      >
        <Suspense fallback="menu loading">
          <MenuContent name={name} items={items} simple={simple} />
        </Suspense>
      </RuiToolbar.Root>
      <Suspense fallback="children loading">
        {children}
      </Suspense>
    </Menu>
  );
}
