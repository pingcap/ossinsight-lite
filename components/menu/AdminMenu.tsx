import { logout } from '@/actions/auth';
import BoxArrowRightIcon from '@/components/icons/box-arrow-right.svg';
import GridIcon from '@/components/icons/grid.svg';
import { MenuItem } from '@ossinsight-lite/ui/components/menu';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function AdminMenu () {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <>
      <MenuItem id="Home" order={-9999} href="/" prefetch={false} text={<GridIcon />} />
      <MenuItem id="Logout" order={-9998} text={<BoxArrowRightIcon />} action={() => startTransition(() => logout().then(() => {
        router.push('/');
        router.refresh();
      }))} />
    </>
  );
}
