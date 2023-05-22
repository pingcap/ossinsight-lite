import * as RuiToolbar from '@radix-ui/react-toolbar';
import { MenuContentProps } from '../menu';

export const renderSeparator: MenuContentProps['renderSeparator'] = () => {
  return <></>;
};

export const renderParentItem: MenuContentProps['renderParentItem'] = () => {
  throw new Error('ToolbarMenu does not support parent item.');
};

export const renderItem: MenuContentProps['renderItem'] = (item) => {
  return (
    <RuiToolbar.Button
      onClick={item.action}
      key={item.id}
      data-layer-item
    >
      {item.text}
    </RuiToolbar.Button>
  );
};

export const renderCustomItem: MenuContentProps['renderCustomItem'] = () => {
  throw new Error('ToolbarMenu does not support custom item.');
}

export const renderLinkItem: MenuContentProps['renderLinkItem'] = () => {
  throw new Error('ToolbarMenu does not support link item.');
}
