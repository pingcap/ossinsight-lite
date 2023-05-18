import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDashboards } from '@/src/_pages/Dashboards/List';
import { MenuItem } from '@/packages/ui/components/menu';
import ThreeDotsIcon from '@/src/icons/three-dots.svg';

const AppMenu = () => {
  const router = useRouter();
  const navigate = useCallback((target: string) => {
    // todo: typing?
    router.push(target as any);
  }, []);
  const dashboards = useDashboards();

  return (
    <>
      <MenuItem id="Logo" order={0} text="Home" disabled={false} custom>
        <span>
          OSSInsight Lite
        </span>
      </MenuItem>
      <MenuItem id="sep" order={1} separator />
      <MenuItem id="More" order={100} text={<ThreeDotsIcon />} disabled={false} parent>
        <MenuItem id="Dashboards" order={2} text="Dashboards" disabled={false} parent>
          {dashboards.map((dashboard, index) => (
            <MenuItem
              key={dashboard}
              id={dashboard}
              order={index}
              disabled={false}
              text={dashboard}
              action={() => navigate(dashboard === 'default' ? '/' : `/dashboards/${dashboard}`)}
            />
          ))}
        </MenuItem>
        <MenuItem id="Widgets" order={1} text="Widgets" disabled={false} action={() => navigate('/browse')} />
      </MenuItem>
    </>
  );
};

export default AppMenu;
