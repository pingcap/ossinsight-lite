import { MenuItem } from '@/packages/ui/components/menu';
import GridIcon from '@/src/icons/grid.svg';

export default function AdminMenu () {
  return (
    <MenuItem id="Home" order={-9999} href="/" text={<GridIcon />} />
  );
}
