'use client';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import { Suspense } from 'react';
import { Menu, MenuProps } from '../menu/Menu';
import * as renderers from './content';
import clsx from 'clsx';
import { MenuContent } from '../menu';

export interface NavMenuProps extends NavigationMenuProps, MenuProps {
}

export function NavMenu ({ name, auto, children, className, ...props }: NavMenuProps) {
  return (
    <Menu name={name} auto={auto}>
      <NavigationMenu.Root {...props} className="relative z-50 bg-cyan-500 bg-opacity-20">
        <NavigationMenu.List className={clsx('flex gap-2 items-center relative z-[1]', className)}>
          <MenuContent name={name} {...renderers} />
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <Suspense fallback="children loading">
        {children}
      </Suspense>
    </Menu>
  );
}