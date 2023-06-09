'use client';
import LayoutWtfIcon from '@/components/icons/layout-wtf.svg';
import LockIcon from '@/components/icons/lock.svg';
import PlusIcon from '@/components/icons/plus.svg';
import UnlockIcon from '@/components/icons/unlock.svg';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { startAppStateLoadingTransition } from '@/core/bind-client';
import { MenuItem } from '@/packages/ui/components/menu';
import { NavMenu } from '@/packages/ui/components/nav-menu';
import { isSSR } from '@/packages/ui/utils/ssr';
import { useAppBusy } from '@/store/features/app';
import { useResolvedWidgets } from '@/store/features/widgets';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useMemo } from 'react';

export default function DashboardMenu ({ dashboardNames }: { dashboardNames: string[] }) {
  const router = useRouter();
  const busy = useAppBusy();

  const { dashboardName, editing, toggleEditing } = useContext(DashboardContext);

  const widgets = useResolvedWidgets();

  const configurableWidgets = useMemo(() => {
    return Object.values(widgets).filter(widget => !!widget.ConfigureComponent);
  }, [widgets]);

  const handleClickNew = useCallback(() => {
    startAppStateLoadingTransition(() => {
      router.push(`/dashboards/${dashboardName}/items/add`);
    });
  }, [dashboardName]);

  const disabled = isSSR ? false : busy;

  return (
    <NavMenu position="top" className="h-[40px] p-[4px] min-w-[250px]">
      <MenuItem id="sep" order={0} separator />
      {!editing && <MenuItem id="Dashboards" order={60} text={<LayoutWtfIcon />} parent>
        {dashboardNames.map((dashboard, index) => (
          <MenuItem
            key={dashboard}
            id={dashboard}
            order={index}
            text={dashboard}
            disabled={disabled}
            prefetch={false}
            href={dashboardHref(dashboard)}
          />
        ))}
      </MenuItem>}
      {editing && (
        <MenuItem text={<PlusIcon width={20} height={20} />} id="new" order={40} disabled={disabled} parent>
          {configurableWidgets.map(({ name, displayName, Icon }, index) => (
            <MenuItem
              id={name}
              key={name}
              order={index}
              action={() => router.push(`/widgets/create/${encodeURIComponent(name)}`)}
              text={(
                <div className="flex justify-between items-center min-w-[180px] text-sm text-gray-600">
                  <span>{displayName}</span>
                  {Icon && <Icon />}
                </div>
              )}
            >
            </MenuItem>
          ))}
          <MenuItem id="sep" order={998} separator />
          <MenuItem id={'new'} order={999} action={handleClickNew} text={<span className="inline-block min-w-[180px] text-sm text-left text-gray-600">Browse library</span>} />
        </MenuItem>
      )}
      <MenuItem id="switch-editing" order={50} disabled={disabled} text={editing ? <UnlockIcon /> : <LockIcon />} action={toggleEditing} />
    </NavMenu>
  );
}

function dashboardHref (name: string) {
  if (name === 'default') {
    return `/` as const;
  } else {
    return `/dashboards/${name}` as const;
  }
}
