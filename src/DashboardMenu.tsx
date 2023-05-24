'use client';
import { appState, dashboards } from '@/app/bind';
import { MenuItem } from '@/packages/ui/components/menu';
import { useCollectionKeys, useWatchReactiveValueField } from '@/packages/ui/hooks/bind/hooks';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import CloudDownloadIcon from '@/src/icons/cloud-download.svg';
import LayoutWtfIcon from '@/src/icons/layout-wtf.svg';
import LockIcon from '@/src/icons/lock.svg';
import PlusIcon from '@/src/icons/plus.svg';
import UnlockIcon from '@/src/icons/unlock.svg';
import SlidersIcon from '@/src/icons/sliders.svg';

export default function DashboardMenu ({ dashboardName, editMode }: { dashboardName: string, editMode: boolean }) {
  const routing = useWatchReactiveValueField(appState, 'routing');
  const fetchingConfig = useWatchReactiveValueField(appState, 'fetchingConfig');
  const dashboardNames = useCollectionKeys(dashboards) as string[];

  return (
    <>
      <MenuItem id="Admin" order={9999} href="/admin/dashboards" text={<SlidersIcon />} />
      <MenuItem id="Dashboards" order={60} text={<LayoutWtfIcon />} parent>
        {dashboardNames.map((dashboard, index) => (
          <MenuItem
            key={dashboard}
            id={dashboard}
            order={index}
            text={dashboard}
            disabled={routing}
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
        <MenuItem text={<PlusIcon width={20} height={20} />} id="new" order={2} disabled={routing} href={`/dashboards/${dashboardName}/items/add`} />
      )}
      <MenuItem id="EditModeSwitch" order={10} disabled={routing} text={editMode ? <UnlockIcon /> : <LockIcon />} href={dashboardHref(dashboardName, !editMode)} />
      <MenuItem id="DownloadLayoutJSON" order={100} custom>
        <a href="/api/layout.json" download="layout.json">
          <CloudDownloadIcon />
        </a>
      </MenuItem>
    </>
  );
}

function dashboardHref (name: string, edit: boolean) {
  if (edit) {
    return `/dashboards/${name}/edit`;
  }
  if (name === 'default') {
    return `/`;
  } else {
    return `/dashboards/${name}`;
  }
}
