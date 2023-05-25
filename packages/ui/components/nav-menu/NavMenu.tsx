'use client';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import clsx from 'clsx';
import { Suspense } from 'react';
import { DirectItemsProps, MenuContent } from '../menu';
import { Menu, MenuProps } from '../menu/Menu';
import * as renderers from './content';

export interface NavMenuProps extends NavigationMenuProps, MenuProps, DirectItemsProps {
  position: 'top' | 'bottom' | 'in-place';
}

export function NavMenu ({ name, auto, children, className, items, simple = false, position = 'in-place', ...props }: NavMenuProps) {
  return (
    <Menu name={name} auto={auto} renderers={renderers} simple={simple}>
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
          <MenuContent name={name} items={items} simple={simple} />
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <Suspense>
        {children}
      </Suspense>
    </Menu>
  );
}