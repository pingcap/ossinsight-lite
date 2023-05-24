'use client';
import AdminMenu from '@/src/AdminMenu';
import DashboardMenu from '@/src/DashboardMenu';
import { usePathname } from 'next/navigation';

export default function Default () {
  const path = usePathname();

  if (!path) {
    return null
  }

  if (path?.startsWith('/admin/')) {
    return <AdminMenu />;
  }

  if (path === '/') {
    return <DashboardMenu dashboardName="default" editMode={false} />
  }

  const [dashboards, name, edit, ...rest] = path.replace(/^\//, '').split('/')

  console.log(path)

  if (rest.length === 0) {
    if (dashboards === 'dashboards') {
      if (edit === 'edit') {
        return <DashboardMenu dashboardName={decodeURIComponent(name)} editMode={true} />
      }
      if (!edit) {
        return <DashboardMenu dashboardName={decodeURIComponent(name)} editMode={false} />
      }
    }
  }

  return null;
}

export const dynamic = 'force-dynamic';
