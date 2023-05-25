import { MenuItem } from '@/packages/ui/components/menu';
import BoxArrowRightIcon from '@/src/icons/box-arrow-right.svg';
import GridIcon from '@/src/icons/grid.svg';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { logout } from './actions';

export default function AdminMenu () {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <>
      <MenuItem id="Home" order={-9999} href="/" prefetch={false} text={<GridIcon />} />
      <MenuItem id="Home" order={-9998} text={<BoxArrowRightIcon />} action={() => startTransition(() => logout().then(() => {
        router.push('/');
        router.refresh();
      }))} />
    </>
  );
}
