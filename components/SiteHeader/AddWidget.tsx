import { DashboardContext } from '@/components/pages/Dashboard/context';
import { isDemoSite } from '@/components/SiteHeader/utils';
import { startAppStateLoadingTransition } from '@/core/bind-client';
import authApi from '@/store/features/auth';
import { useResolvedWidgets } from '@/store/features/widgets';
import * as Menubar from '@radix-ui/react-menubar';
import PlusIcon from 'bootstrap-icons/icons/plus.svg';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useMemo } from 'react';

export function AddWidget () {
  const { dashboardName, editing } = useContext(DashboardContext);
  const router = useRouter();
  const widgets = useResolvedWidgets();
  const { data } = authApi.useReloadQuery();

  const configurableWidgets = useMemo(() => {
    return Object.values(widgets).filter(widget => !!widget.ConfigureComponent);
  }, [widgets]);

  const handleClickNew = useCallback(() => {
    startAppStateLoadingTransition(() => {
      router.push(`/dashboards/${dashboardName}/items/add`);
    });
  }, [dashboardName]);

  if (!editing) {
    return null;
  }

  if (isDemoSite() && !data?.authenticated) {
    return (
      <button className="site-header-item" onClick={handleClickNew}>
        <PlusIcon className="site-header-item" />
        Add a widget
      </button>
    );
  }

  return (
    <Menubar.Menu>
      <Menubar.Trigger>
        <span className="site-header-item">
          <PlusIcon />
          Add a widget
        </span>
        <Menubar.Portal>
          <Menubar.Content className="site-header-submenu-content">
            <Menubar.Item className="menuitem menuitem-widget" onClick={handleClickNew}>
              From Saved Widgets
            </Menubar.Item>
            {<Menubar.Separator className="menuseparator" />}
            {configurableWidgets.map(({ name, displayName, Icon }, index) => (
              <Menubar.Item
                className="menuitem menuitem-widget"
                key={name}
                onClick={() => router.push(`/widgets/create/${encodeURIComponent(name)}`)}
              >
                <span>{displayName}</span>
                {Icon && <Icon />}
              </Menubar.Item>
            ))}
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Trigger>
    </Menubar.Menu>
  );
}