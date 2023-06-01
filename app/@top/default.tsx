'use client';
import DashboardMenu from '@/components/menu/DashboardMenu';
import { startAppStateLoadingTransition } from '@/core/bind';
import { widgets } from '@/core/bind-client';
import { ResolvedWidgetModule } from '@/core/widgets-manifest';
import { useCollectionValues } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { usePathname, useRouter } from 'next/navigation';

export default function Default () {
  const path = usePathname();
  const resolvedWidgets = useCollectionValues(widgets);
  const router = useRouter();

  if (!path) {
    return null;
  }

  const handleCreateWidget = useRefCallback((widget: ResolvedWidgetModule) => {
    if (!!widget.ConfigureComponent) {
      startAppStateLoadingTransition(() => {
        router.push(`/widgets/create/${encodeURIComponent(widget.name)}`);
      });
    }
  });

  if (path === '/') {
    return <DashboardMenu dashboardName="default" editMode={false} />;
  }

  const [dashboards, name, edit, ...rest] = path.replace(/^\//, '').split('/');

  if (rest.length === 0) {
    if (dashboards === 'dashboards') {
      if (edit === 'edit') {
        return (
          <>
            <DashboardMenu dashboardName={decodeURIComponent(name)} editMode={true} />
          </>
        );
      }
      if (!edit) {
        return <DashboardMenu dashboardName={decodeURIComponent(name)} editMode={false} />;
      }
    }
  }

  return null;
}
