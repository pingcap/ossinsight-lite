import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MenuItem } from '@/packages/ui/components/menu';
import ThreeDotsIcon from '@/src/icons/three-dots.svg';

import Link from 'next/link';

const AppMenu = ({ dashboardNames }: { dashboardNames: string[] }) => {
  const router = useRouter();
  const navigate = useCallback((dashboard: string) => {
    router.push(dashboard === 'default' ? '/' : `/dashboards/${dashboard}`);
  }, []);

  return (
    <>
      <MenuItem id="Logo" order={0} text="Home" disabled={false} custom>
        <Link href="/">
          OSSInsight Lite
        </Link>
      </MenuItem>
      <MenuItem id="sep" order={1} separator />
      <MenuItem id="More" order={100} text={<ThreeDotsIcon />} disabled={false} parent>
        <MenuItem id="Admin" order={2} disabled={false} href='/admin/dashboards' text='Admin' />
        <MenuItem id="Dashboards" order={3} text="Dashboards" disabled={false} parent>
          {dashboardNames.map((dashboard, index) => (
            <MenuItem
              key={dashboard}
              id={dashboard}
              order={index}
              disabled={false}
              text={dashboard}
              action={() => navigate(dashboard)}
            />
          ))}
        </MenuItem>
      </MenuItem>
    </>
  );
};

export default AppMenu;
