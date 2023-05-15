import * as RuiToolbar from '@radix-ui/react-toolbar';
import { MenuContentProps } from '../menu';
import { stopPropagation } from './common.ts';

export const renderGroup: MenuContentProps['renderGroup'] = (_, children) => {
  return children;
};

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
      <span>
        {item.extraText}
      </span>
    </RuiToolbar.Button>
  );
};
