import * as RuiMenubar from '@radix-ui/react-menubar';
import clsx from 'clsx';
import Link from 'next/link';
import { createContext, useContext } from 'react';
import { MenuRenderers } from '../menu';
import './style.scss';

const PrivateContext = createContext({
  isSub: false,
});

export const renderSeparator: MenuRenderers['renderSeparator'] = (item) => {
  return <RuiMenubar.Separator className="navmenu-sep" key={item.id} style={{ order: item.order }} />;
};

export const renderParentItem: MenuRenderers['renderParentItem'] = (item, _, children) => {
  const { isSub } = useContext(PrivateContext);
  if (isSub) {
    throw new Error('nested navmenu item not supported yet.');
  }

  return (
    <RuiMenubar.Menu key={item.id}>
      <RuiMenubar.Trigger
        style={{ order: item.order }}
        className="navmenu-item relative z-0 p-1 cursor-pointer"
        disabled={item.disabled}
      >
        {item.text}
      </RuiMenubar.Trigger>
      <RuiMenubar.Portal>
        <RuiMenubar.Content className={clsx('navmenu-sub z-50 bg-white rounded shadow-lg min-w-max py-2 flex flex-col')} align="end">
          <PrivateContext.Provider value={{ isSub: true }}>
            {children}
          </PrivateContext.Provider>
        </RuiMenubar.Content>
      </RuiMenubar.Portal>
    </RuiMenubar.Menu>
  );
};

export const renderItem: MenuRenderers['renderItem'] = (item) => {
  const { isSub } = useContext(PrivateContext);
  let el = (
    <button key={item.id} onClick={item.action} disabled={item.disabled} style={{ order: item.order }} className={clsx('navmenu-item p-1', item.disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer')}>
      {item.text}
    </button>
  );
  if (isSub) {
    el = <RuiMenubar.Item key={item.id} asChild>{el}</RuiMenubar.Item>;
  }
  return el;
};

export const renderCustomItem: MenuRenderers['renderCustomItem'] = (item) => {
  const { isSub } = useContext(PrivateContext);
  if (!isSub) {
    return <div key={item.id} className="navmenu-item p-1" style={{ order: item.order }}>{item.children}</div>;
  }
  return (
    <RuiMenubar.Item key={item.id} className="navmenu-item p-1" style={{ order: item.order }}>
      {item.children}
    </RuiMenubar.Item>
  );
};

export const renderLinkItem: MenuRenderers['renderLinkItem'] = ({ order, id, text, disabled, ...props }) => {
  const { isSub } = useContext(PrivateContext);

  let el = disabled
    ? <span key={id} className="navmenu-item inline-flex p-1 text-gray-400 cursor-not-allowed" style={{ order: order }}>{text}</span>
    : <Link key={id} className="navmenu-item inline-flex p-1 cursor-pointer" {...props} style={{ order: order }}>{text}</Link>;

  if (isSub) {
    el = <RuiMenubar.Item key={id} asChild>{el}</RuiMenubar.Item>;
  }

  return el;
};
