import * as RuiToolbar from '@radix-ui/react-toolbar';
import Link from 'next/link';
import { MenuRenderers } from '../menu';

export const renderSeparator: MenuRenderers['renderSeparator'] = (item) => {
  return <span style={{ order: item.order }} className="flex-1"></span>;
};

export const renderParentItem: MenuRenderers['renderParentItem'] = () => {
  throw new Error('ToolbarMenu does not support parent item.');
};

export const renderItem: MenuRenderers['renderItem'] = (item) => {
  return (
    <RuiToolbar.Button
      style={{ order: item.order }}
      className="p-1 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity"
      onClick={item.action}
      key={item.id}
    >
      {item.text}
    </RuiToolbar.Button>
  );
};

export const renderCustomItem: MenuRenderers['renderCustomItem'] = (item) => {
  return (
    <span
      style={{ order: item.order }}
      className="p-1 flex items-center justify-center rounded opacity-100"
      key={item.id}
    >
      {item.children}
    </span>
  );
};

export const renderLinkItem: MenuRenderers['renderLinkItem'] = ({ order, id, text, disabled, ...props }) => {
  return (
    <RuiToolbar.Link
      style={{ order: order }}
      key={id}
      className="p-1 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity"
      asChild
    >
      {disabled
        ? <span className="text-gray-400 cursor-not-allowed">{text}</span>
        : <Link {...props}>{text}</Link>}
    </RuiToolbar.Link>
  );
};
