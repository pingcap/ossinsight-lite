import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import { MenuContent } from '../menu';
import { Suspense } from 'react';
import { Menu, MenuProps } from '../menu/Menu.tsx';
import * as renderers from './content.tsx';
import clsx from 'clsx';

export interface NavMenuProps extends NavigationMenuProps, MenuProps {
}

export function NavMenu ({ name, auto, children, className, ...props }: NavMenuProps) {
  return (
    <Menu name={name} auto={auto}>
      <NavigationMenu.Root {...props} className='relative z-50 bg-white bg-opacity-20 backdrop-blur'>
        <Suspense fallback="menu loading">
          <NavigationMenu.List className={clsx('flex gap-2 items-center relative z-[1]', className)}>
            <MenuContent name={name} {...renderers} />
          </NavigationMenu.List>
        </Suspense>
      </NavigationMenu.Root>
      <Suspense fallback="children loading">
        {children}
      </Suspense>
    </Menu>
  );
}