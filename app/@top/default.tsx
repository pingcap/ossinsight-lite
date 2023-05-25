'use client';
import { widgets } from '@/app/bind-client';
import { MenuItem } from '@/packages/ui/components/menu';
import { useCollectionValues } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import DashboardMenu from '@/src/DashboardMenu';
import { ResolvedWidgetModule } from '@/src/widgets-manifest';
import { usePathname, useRouter } from 'next/navigation';

export default function Default () {
  const path = usePathname();
  const resolvedWidgets = useCollectionValues(widgets);
  const router = useRouter();

  if (!path) {
    return null;
  }

  const widgetsWithNewButton = resolvedWidgets
    .filter((widget) => !!widget.NewButton && !!widget.configureComponent);

  const handleCreateWidget = useRefCallback((widget: ResolvedWidgetModule) => {
    if (!!widget.configureComponent) {
      router.push(`/widgets/create/${encodeURIComponent(widget.name)}`);
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
            {widgetsWithNewButton.map((module, index) => {
              const NewButton = module.NewButton!;
              return (
                <MenuItem id={module.name + ':add'} key={module.name + ':add'} order={index} custom>
                  <NewButton onClick={() => handleCreateWidget(module)} />
                </MenuItem>
              );
            })}
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

export const dynamic = 'force-dynamic';
