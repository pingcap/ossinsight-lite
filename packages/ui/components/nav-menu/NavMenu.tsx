import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import { MenuContent } from '../menu';
import { Suspense } from 'react';
import { Menu, MenuProps } from '../menu/Menu.tsx';
import * as renderers from './content.tsx';
import clsx from 'clsx';

export interface NavMenuProps extends NavigationMenuProps, MenuProps {
}

export function NavMenu ({ name, auto, children, ...props }: NavMenuProps) {
  return (
    <Menu name={name} auto={auto}>
      <NavigationMenu.Root {...props} className={clsx('relative z-[1]', props.className)}>
        <NavigationMenu.List className='flex gap-2'>
          <Suspense fallback="menu loading">
            <MenuContent name={name} {...renderers} />
          </Suspense>
        </NavigationMenu.List>
        <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
          <NavigationMenu.Viewport className="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-white transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
        </div>
      </NavigationMenu.Root>
      <Suspense fallback="children loading">
        {children}
      </Suspense>
    </Menu>
  );
}