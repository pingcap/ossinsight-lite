import { DashboardContext } from '@/components/pages/Dashboard/context';
import * as Menubar from '@radix-ui/react-menubar';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg';
import LockIcon from 'bootstrap-icons/icons/pencil.svg';
import UnlockIcon from 'bootstrap-icons/icons/check.svg';
import clsx from 'clsx';
import Link from 'next/link';
import { useContext } from 'react';

export function MenuDashboardItem ({ dashboardNames }: { dashboardNames: string[] }) {
  const { editing, toggleEditing, dashboardName } = useContext(DashboardContext);

  return (
    <span className="site-dashboard site-header-item-optional">
      <button className="site-dashboard-editing-button" onClick={toggleEditing}>
        {editing ? <UnlockIcon /> : <LockIcon />}
      </button>
      <Menubar.Menu>
        <Menubar.Trigger className="site-dashboard-select">
          {dashboardName}
          <ChevronDownIcon className="site-header-item-indicator" width={12} height={12} />
          <Menubar.Portal>
            <Menubar.Content className="site-header-submenu-content" sideOffset={2} align="end">
              {dashboardNames.map((name) => (
                <Menubar.Item key={name} className={clsx('menuitem', { active: name === dashboardName })}>
                  {name === dashboardName
                    ? <span>{name}</span>
                    : <Link href={getDashboardHref(name)} prefetch={false}>{name}</Link>
                  }
                </Menubar.Item>
              ))}
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Trigger>
      </Menubar.Menu>
    </span>
  );
}

function getDashboardHref (name: string) {
  if (name === 'default') {
    return '/';
  } else {
    return `/dashboards/${encodeURIComponent(name)}`;
  }
}
