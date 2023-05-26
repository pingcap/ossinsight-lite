'use client';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
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
      <NavigationMenu.Root
        {...props}
        className={clsx(
          'hover:backdrop-blur-sm transition-all',
          position === 'top' && 'fixed left-0 w-screen z-50 top-0',
          position === 'bottom' && 'fixed left-0 w-screen z-50 bottom-0',
          position === 'in-place' && 'relative',
        )}
      >
        <NavigationMenu.List className={clsx('flex gap-2 items-center relative z-[1]', className)}>
          {items}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Menu>
  );
}