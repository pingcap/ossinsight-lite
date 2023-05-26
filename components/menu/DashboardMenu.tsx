'use client';
import { appState, dashboards, startAppStateLoadingTransition } from '@/core/bind';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { MenuItem } from '@/packages/ui/components/menu';
import { useCollectionKeys, useWatchReactiveValueField } from '@/packages/ui/hooks/bind/hooks';
import LayoutWtfIcon from '@/components/icons/layout-wtf.svg';
import LockIcon from '@/components/icons/lock.svg';
import PlusIcon from '@/components/icons/plus.svg';
import UnlockIcon from '@/components/icons/unlock.svg';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function DashboardMenu ({ dashboardName, editMode }: { dashboardName: string, editMode: boolean }) {
  const router = useRouter();
  const loading = useWatchReactiveValueField(appState, 'loading');
  const fetchingConfig = useWatchReactiveValueField(appState, 'fetchingConfig');
  const dashboardNames = useCollectionKeys(dashboards) as string[];

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
        <MenuItem text={<PlusIcon width={20} height={20} />} id="new" order={2} disabled={loading > 0} action={handleClickNew} />
      )}
      <MenuItem id="EditModeSwitch" order={10} disabled={loading > 0} text={editMode ? <UnlockIcon /> : <LockIcon />} action={() => startAppStateLoadingTransition(() => router.push(dashboardHref(dashboardName, !editMode)))} />
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
