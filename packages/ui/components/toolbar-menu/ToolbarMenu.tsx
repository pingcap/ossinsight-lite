import * as RuiToolbar from '@radix-ui/react-toolbar';
import { ToolbarProps } from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import { DirectItemsProps } from '../menu';
import { Menu } from '../menu/Menu';
import * as renderers from './content';

export interface ToolbarMenuProps extends ToolbarProps, DirectItemsProps {
}

export function ToolbarMenu ({ children, items, ...props }: ToolbarMenuProps) {
  return (
    <Menu renderers={renderers}>
      <RuiToolbar.Root
        {...props}
        className={clsx('z-[1]', props.className)}
      >
        {items}
      </RuiToolbar.Root>
    </Menu>
  );
}
