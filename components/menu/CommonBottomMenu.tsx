import GearIcon from '@/components/icons/gear.svg';
import { MenuItem } from '@/packages/ui/components/menu';

export default function CommonBottomMenu ({ children }: any) {
  return (
    <>
      <MenuItem id="Admin" order={-9999} href="/admin/dashboards" prefetch={false} text={<GearIcon />} />
    </>
  );
}