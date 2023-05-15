import * as RuiNavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { MenuContentProps } from '../menu';

export const renderGroup: MenuContentProps['renderGroup'] = (_, children) => {
  return children;
};

export const renderSeparator: MenuContentProps['renderSeparator'] = () => {
  return <></>;
};

export const renderParentItem: MenuContentProps['renderParentItem'] = (item, children) => {
  return (
    <RuiNavigationMenu.Item key={item.id}>
      <RuiNavigationMenu.Trigger
        className="outline-none flex justify-between items-center"
        disabled={item.disabled}
      >
        {item.text}
        <span className="text-gray-400">
          <CaretDownIcon
            className="relative top-[1px] transition-transform duration-[250ms] ease-in group-data-[state=open]:-rotate-180"
            aria-hidden
          />
        </span>
      </RuiNavigationMenu.Trigger>
      <RuiNavigationMenu.Content>
        <RuiNavigationMenu.Sub>
          <RuiNavigationMenu.List>
            {children}
          </RuiNavigationMenu.List>
        </RuiNavigationMenu.Sub>
      </RuiNavigationMenu.Content>
    </RuiNavigationMenu.Item>
  );
};

export const renderItem: MenuContentProps['renderItem'] = (item) => {
  return (
    <RuiNavigationMenu.Item
      className="min-w-[112px] outline-none bg-transparent hover:bg-gray-50 transition:colors p-1 cursor-pointer flex justify-between items-center"
      onClick={item.action}
      key={item.id}
    >
      <RuiNavigationMenu.Trigger disabled={item.disabled}>
        {item.text}
        <span>
          {item.extraText}
        </span>
      </RuiNavigationMenu.Trigger>
    </RuiNavigationMenu.Item>
  );
};
