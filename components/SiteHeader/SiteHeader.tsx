'use client';
import AppContext from '@/packages/ui/context/app';
import { useWindowVerticallyScrolling } from '@/utils/useScrolling';
import * as Menubar from '@radix-ui/react-menubar';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg';
import clsx from 'clsx';
import Link from 'next/link';
import { useContext } from 'react';
import { AddWidget } from './AddWidget';
import DownloadLayoutJson from './DownloadLayoutJson';
import { MenuDashboardItem } from './MenuDashboardItem';
import { SQLEditorButton } from './SQLEditorButton';
import { UserMenuItems } from './UserMenuItems';

export interface SiteHeaderProps {
  contentGroup?: 'dashboard' | 'admin' | 'public';
  dashboardNames?: string[];
}

export function SiteHeader ({ dashboardNames = [], contentGroup = 'dashboard' }: SiteHeaderProps) {
  const scrolling = useWindowVerticallyScrolling();
  const { currentUser } = useContext(AppContext)

  return (
    <Menubar.Root asChild>
      <header className={clsx('site-header', { scrolling })}>
        <span className="site-title">
          {`${currentUser.login}'s ${contentGroup === 'admin' ? 'Admin' : 'Dashboard'}`}
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
        {contentGroup === 'admin' && (
          <Link className="site-header-item btn btn-link" href="/" prefetch={false}>
            <ChevronLeftIcon />
            Back to home
          </Link>
        )}
        <UserMenuItems contentGroup={contentGroup} />
      </header>
    </Menubar.Root>
  );
}