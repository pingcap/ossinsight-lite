'use client';
import { DashboardMenuItems } from '@/components/SiteHeader/DashboardMenuItems';
import { MenuDashboardItem } from '@/components/SiteHeader/MenuDashboardItem';
import { SQLEditorButton } from '@/components/SiteHeader/SQLEditorButton';
import { UserMenuItems } from '@/components/SiteHeader/UserMenuItems';
import { useWindowVerticallyScrolling } from '@/utils/useScrolling';
import cu from '@ossinsight-lite/widgets/src/widgets/oh-my-github/curr_user.sql?unique';
import * as Menubar from '@radix-ui/react-menubar';
import clsx from 'clsx';

export interface SiteHeaderProps {
  dashboardNames: string[];
}

export function SiteHeader ({ dashboardNames }: SiteHeaderProps) {
  const scrolling = useWindowVerticallyScrolling();

  return (
    <Menubar.Root asChild>
      <header className={clsx('site-header', { scrolling })}>
        <span className="site-title">
          {`${cu.login}'s Dashboard`}
        </span>
        <MenuDashboardItem dashboardNames={dashboardNames} />
        <SQLEditorButton />
        <span className="spacer" />
        <DashboardMenuItems />
        <UserMenuItems />
      </header>
    </Menubar.Root>
  );
}