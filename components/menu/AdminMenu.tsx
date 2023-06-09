'use client';
import { logout } from '@/actions/auth';
import BoxArrowRightIcon from '@/components/icons/box-arrow-right.svg';
import GridIcon from '@/components/icons/grid.svg';
import { NavMenu } from '@/packages/ui/components/nav-menu';
import { MenuItem } from '@ossinsight-lite/ui/components/menu';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function AdminMenu () {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <NavMenu position="top" className="h-[40px] p-[4px] min-w-[250px]">
      <MenuItem id="sep" order={0} separator />
      <MenuItem id="Home" order={9998} href="/" prefetch={false} text={<GridIcon />} />
      <MenuItem id="Logout" order={9999} text={<BoxArrowRightIcon />} action={() => startTransition(() => logout().then(() => {
        router.push('/');
        router.refresh();
      }))} />
    </NavMenu>
  );
}
