'use client';
import CloudDownloadIcon from '@/components/icons/cloud-download.svg';
import GearIcon from '@/components/icons/gear.svg';
import AdminMenu from '@/components/menu/AdminMenu';
import { MenuItem } from '@/packages/ui/components/menu';
import { usePathname } from 'next/navigation';

export default function Default () {
  const path = usePathname();

  if (!path) {
    return null;
  }

  if (path?.startsWith('/admin/')) {
    return <AdminMenu />;
  }

  if (path === '/') {
    return dashboardsItems();
  }

  const [dashboards, name, edit, ...rest] = path.replace(/^\//, '').split('/');

  if (rest.length === 0) {
    if (dashboards === 'dashboards') {
      if (edit === 'edit') {
        return dashboardsItems();
      }
      if (!edit) {
        return dashboardsItems();
      }
    }
  }

  return null;
}

const dashboardsItems = () => (
  <>
    <MenuItem id="Admin" order={-9999} href="/admin/dashboards" prefetch={false} text={<GearIcon />} />
    <MenuItem id="DownloadLayoutJSON" order={100} custom>
      <a href="/api/layout.json" download="layout.json">
        <CloudDownloadIcon />
      </a>
    </MenuItem>
  </>
);
