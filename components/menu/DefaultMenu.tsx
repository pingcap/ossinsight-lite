'use client';
import { MenuItem } from '@/packages/ui/components/menu';
import { NavMenu } from '@/packages/ui/components/nav-menu';
import HouseIcon from 'bootstrap-icons/icons/house.svg';

export default function DefaultMenu () {
  return (
    <NavMenu position="top" className="h-[40px] p-[4px] min-w-[250px]">
      <MenuItem id="sep" order={0} separator />
      <MenuItem id="home" order={1} href="/" prefetch={false} text={<HouseIcon />} />
    </NavMenu>
  );
}
