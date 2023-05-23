import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MenuItem } from '@/packages/ui/components/menu';
import SlidersIcon from '@/src/icons/sliders.svg';
import LayoutWtfIcon from '@/src/icons/layout-wtf.svg';

const AppMenu = ({ dashboardNames }: { dashboardNames: string[] }) => {
  const router = useRouter();
  const navigate = useCallback((dashboard: string) => {
    router.push(dashboard === 'default' ? '/' : `/dashboards/${dashboard}`);
  }, []);

  return (
    <>
      <MenuItem id="sep" order={-1} separator />
      <MenuItem id="Admin" order={9999} href="/admin/dashboards" text={<SlidersIcon />} />
      <MenuItem id="Dashboards" order={60} text={<LayoutWtfIcon />} parent>
        {dashboardNames.map((dashboard, index) => (
          <MenuItem
            key={dashboard}
            id={dashboard}
            order={index}
            text={dashboard}
            action={() => navigate(dashboard)}
          />
        ))}
      </MenuItem>
    </>
  );
};

export default AppMenu;
