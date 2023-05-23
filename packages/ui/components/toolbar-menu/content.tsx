import * as RuiToolbar from '@radix-ui/react-toolbar';
import { MenuContentProps } from '../menu';
import Link from 'next/link';

export const renderSeparator: MenuContentProps['renderSeparator'] = () => {
  return <></>;
};

export const renderParentItem: MenuContentProps['renderParentItem'] = () => {
  throw new Error('ToolbarMenu does not support parent item.');
};

export const renderItem: MenuContentProps['renderItem'] = (item) => {
  return (
    <RuiToolbar.Button
      style={{ order: item.order }}
      className='p-1 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity'
      onClick={item.action}
      key={item.id}
    >
      {item.text}
    </RuiToolbar.Button>
  );
};

export const renderCustomItem: MenuContentProps['renderCustomItem'] = () => {
  throw new Error('ToolbarMenu does not support custom item.');
}

export const renderLinkItem: MenuContentProps['renderLinkItem'] = (item) => {
  return (
    <RuiToolbar.Link
      style={{ order: item.order }}
      key={item.id}
      className='p-1 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity'
      asChild
    >
      <Link href={item.href}>
        {item.text}
      </Link>
    </RuiToolbar.Link>
  )
}
