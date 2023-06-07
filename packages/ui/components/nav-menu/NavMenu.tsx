'use client';
import * as MenuBar from '@radix-ui/react-menubar';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import clsx from 'clsx';
import { DirectItemsProps } from '../menu';
import { Menu } from '../menu/Menu';
import * as renderers from './content';

export interface NavMenuProps extends NavigationMenuProps, DirectItemsProps {
  position: 'top' | 'bottom' | 'in-place';
}

export function NavMenu ({ children, className, items, position = 'in-place', ...props }: NavMenuProps) {
  return (
    <Menu renderers={renderers}>
      <MenuBar.Root
        {...props}
        className={clsx(
          className,
          'hover:backdrop-blur-sm transition-all pointer-events-none flex gap-2 items-center z-[1]',
          position === 'top' && 'fixed left-0 w-screen z-50 top-0',
          position === 'bottom' && 'fixed left-0 w-screen z-50 bottom-0',
          position === 'in-place' && 'relative',
        )}
      >
        {items}
        {children}
      </MenuBar.Root>
    </Menu>
  );
}