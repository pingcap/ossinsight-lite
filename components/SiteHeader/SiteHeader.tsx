'use client';
import { useWindowVerticallyScrolling } from '@/utils/useScrolling';
import cu from '@ossinsight-lite/widgets/src/widgets/oh-my-github/curr_user.sql?unique';
import * as Menubar from '@radix-ui/react-menubar';
import clsx from 'clsx';
import { AddWidget } from './AddWidget';
import DownloadLayoutJson from './DownloadLayoutJson';
import { MenuDashboardItem } from './MenuDashboardItem';
import { SQLEditorButton } from './SQLEditorButton';
import { UserMenuItems } from './UserMenuItems';

export interface SiteHeaderProps {
  contentGroup?: 'dashboard' | 'admin';
  dashboardNames?: string[];
}

export function SiteHeader ({ dashboardNames = [], contentGroup = 'dashboard' }: SiteHeaderProps) {
  const scrolling = useWindowVerticallyScrolling();

  return (
    <Menubar.Root asChild>
      <header className={clsx('site-header', { scrolling })}>
        <span className="site-title">
          {`${cu.login}'s ${contentGroup === 'admin' ? 'Admin' : 'Dashboard'}`}
        </span>
        {contentGroup === 'dashboard' && (
          <>
            <DownloadLayoutJson />
            <MenuDashboardItem dashboardNames={dashboardNames} />
            <SQLEditorButton />
          </>
        )}
        <span className="spacer" />
        <AddWidget />
        <UserMenuItems contentGroup={contentGroup} />
      </header>
    </Menubar.Root>
  );
}