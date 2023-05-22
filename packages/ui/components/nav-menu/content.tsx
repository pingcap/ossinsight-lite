import * as RuiNavigationMenu from '@radix-ui/react-navigation-menu';
import { MenuContentProps } from '../menu';
import clsx from 'clsx';
import Link from 'next/link';

export const renderSeparator: MenuContentProps['renderSeparator'] = (item) => {
  return <RuiNavigationMenu.Item className="flex-1 h-full" key={item.id} style={{ order: item.order }} />;
};

export const renderParentItem: MenuContentProps['renderParentItem'] = (item, isSub, children) => {
  return (
    <RuiNavigationMenu.Item key={item.id} style={{ order: item.order }} className="relative">
      <RuiNavigationMenu.Trigger
        className="relative z-0 outline-none bg-transparent transition:colors p-1 cursor-pointer flex justify-between items-center"
        disabled={item.disabled}
      >
        {item.text}
      </RuiNavigationMenu.Trigger>
      <RuiNavigationMenu.Content className={clsx('absolute z-[11px] bg-white rounded shadow-sm min-w-max p-2', isSub ? 'right-[calc(100%+8px)] top-0' : 'right-0 top-full')}>
        <RuiNavigationMenu.Sub>
          <RuiNavigationMenu.List className="flex flex-col">
            {children}
          </RuiNavigationMenu.List>
        </RuiNavigationMenu.Sub>
      </RuiNavigationMenu.Content>
    </RuiNavigationMenu.Item>
  );
};

export const renderItem: MenuContentProps['renderItem'] = (item) => {
  return (
    <RuiNavigationMenu.Item key={item.id} style={{ order: item.order }}>
      <RuiNavigationMenu.Trigger onClick={item.action} disabled={item.disabled} className="outline-none bg-transparent transition:colors p-1 cursor-pointer flex justify-between items-center">
        {item.text}
      </RuiNavigationMenu.Trigger>
    </RuiNavigationMenu.Item>
  );
};

export const renderCustomItem: MenuContentProps['renderCustomItem'] = (item) => {
  return (
    <RuiNavigationMenu.Item key={item.id} style={{ order: item.order }}>
      {item.children}
    </RuiNavigationMenu.Item>
  );
};

export const renderLinkItem: MenuContentProps['renderLinkItem'] = (item) => {
  return (
    <RuiNavigationMenu.Item key={item.id} style={{ order: item.order }}>
      <RuiNavigationMenu.Link asChild>
        <Link href={item.href} className='inline-flex p-1'>
          {item.text}
        </Link>
      </RuiNavigationMenu.Link>
    </RuiNavigationMenu.Item>
  );
};
