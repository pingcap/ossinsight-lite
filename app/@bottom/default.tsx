'use client';
import AdminBottomMenu from '@/components/menu/AdminBottomMenu';
import CommonBottomMenu from '@/components/menu/CommonBottomMenu';
import DashboardBottomMenu from '@/components/menu/DashboardBottomMenu';
import { usePathname } from 'next/navigation';

export default function Default () {
  const path = usePathname();

  if (!path) {
    return null;
  }

  if (path?.startsWith('/admin/')) {
    return <AdminBottomMenu />;
  }

  if (path === '/') {
    return <DashboardBottomMenu />;
  }

  const [dashboards, name, edit, ...rest] = path.replace(/^\//, '').split('/');

  if (rest.length === 0) {
    if (dashboards === 'dashboards') {
      return <DashboardBottomMenu />;
    }
  }

  return <CommonBottomMenu />;
}
