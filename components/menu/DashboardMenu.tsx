'use client';
import LayoutWtfIcon from '@/components/icons/layout-wtf.svg';
import LockIcon from '@/components/icons/lock.svg';
import PlusIcon from '@/components/icons/plus.svg';
import UnlockIcon from '@/components/icons/unlock.svg';
import { appState, startAppStateLoadingTransition } from '@/core/bind';
import { widgets } from '@/core/bind-client';
import { MenuItem } from '@/packages/ui/components/menu';
import { useWatchReactiveValueField } from '@/packages/ui/hooks/bind/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export default function DashboardMenu ({ dashboardName, dashboardNames, editMode }: { dashboardName: string, dashboardNames: string[], editMode: boolean }) {
  const router = useRouter();
  const loading = useWatchReactiveValueField(appState, 'loading');
  const configurableWidgets = useMemo(() => {
    return widgets.values.filter(widget => !!widget.ConfigureComponent);
  }, []);

  const handleClickNew = useCallback(() => {
    startAppStateLoadingTransition(() => {
      router.push(`/dashboards/${dashboardName}/items/add`);
    });
  }, [dashboardName]);

  return (
    <>
      <MenuItem id="Dashboards" order={60} text={<LayoutWtfIcon />} parent>
        {dashboardNames.map((dashboard, index) => (
          <MenuItem
            key={dashboard}
            id={dashboard}
            order={index}
            text={dashboard}
            disabled={loading > 0}
            prefetch={false}
            href={dashboardHref(dashboard, editMode)}
          />
        ))}
      </MenuItem>
      {editMode && (
        <MenuItem text={<PlusIcon width={20} height={20} />} id="new" order={40} disabled={loading > 0} parent>
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
      <MenuItem id="EditModeSwitch" order={50} disabled={loading > 0} text={editMode ? <UnlockIcon /> : <LockIcon />} action={() => startAppStateLoadingTransition(() => router.push(dashboardHref(dashboardName, !editMode)))} />
    </>
  );
}

function dashboardHref (name: string, edit: boolean) {
  if (edit) {
    return `/dashboards/${name}/edit` as const;
  }
  if (name === 'default') {
    return `/` as const;
  } else {
    return `/dashboards/${name}` as const;
  }
}
