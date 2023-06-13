'use client';
import { DashboardMenuItems } from '@/components/SiteHeader/DashboardMenuItems';
import { MenuDashboardItem } from '@/components/SiteHeader/MenuDashboardItem';
import { UserMenuItems } from '@/components/SiteHeader/UserMenuItems';
import cu from '@ossinsight-lite/widgets/src/widgets/oh-my-github/curr_user.sql?unique';
import * as Menubar from '@radix-ui/react-menubar';

export interface SiteHeaderProps {
  dashboardNames: string[];
}

export function SiteHeader ({ dashboardNames }: SiteHeaderProps) {
  return (
    <Menubar.Root asChild>
      <header className="site-header">
        <span className="site-title">
          {`${cu.login}'s Dashboard`}
        </span>
        <MenuDashboardItem dashboardNames={dashboardNames} />
        <span className="spacer" />
        <DashboardMenuItems />
        <UserMenuItems />
      </header>
    </Menubar.Root>
  );
}