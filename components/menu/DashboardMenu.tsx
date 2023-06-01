'use client';
import LayoutWtfIcon from '@/components/icons/layout-wtf.svg';
import LockIcon from '@/components/icons/lock.svg';
import PlusIcon from '@/components/icons/plus.svg';
import UnlockIcon from '@/components/icons/unlock.svg';
import { appState, dashboards, startAppStateLoadingTransition } from '@/core/bind';
import { widgets } from '@/core/bind-client';
import { MenuItem } from '@/packages/ui/components/menu';
import { useCollectionKeys, useWatchReactiveValueField } from '@/packages/ui/hooks/bind/hooks';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export default function DashboardMenu ({ dashboardName, editMode }: { dashboardName: string, editMode: boolean }) {
  const router = useRouter();
  const loading = useWatchReactiveValueField(appState, 'loading');
  const fetchingConfig = useWatchReactiveValueField(appState, 'fetchingConfig');
  const dashboardNames = useCollectionKeys(dashboards) as string[];
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
        {fetchingConfig && (
          <MenuItem
            key="Fetching config"
            id="Fetching config"
            order={1000}
            custom
          >
            <span className="text-gray-400 flex items-center justify-center">
              <LoadingIndicator />
            </span>
          </MenuItem>
        )}
      </MenuItem>
      {editMode && (
        <MenuItem text={<PlusIcon width={20} height={20} />} id="new" order={40} disabled={loading > 0} parent>
          {configurableWidgets.map(({ name, displayName, Icon }, index) => (
            <MenuItem
              id={name}
              key={name}
              order={index}
              action={() => router.push(`/widgets/${encodeURIComponent(name)}/create`)}
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
