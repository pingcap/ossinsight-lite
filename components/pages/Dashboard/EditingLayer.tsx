import DuplicateIcon from '@/components/icons/copy.svg';
import PaletteIcon from '@/components/icons/palette.svg';
import PencilIcon from '@/components/icons/pencil.svg';
import TrashIcon from '@/components/icons/trash.svg';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { startAppStateLoadingTransition } from '@/core/bind-client';
import { MenuItem } from '@/packages/ui/components/menu';
import { ToolbarMenu } from '@/packages/ui/components/toolbar-menu';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import dashboardsFeature, { useDeleteDashboardItem } from '@/store/features/dashboards';
import libraryFeature, { useLibraryItemField, useUpdateLibraryItem } from '@/store/features/library';
import { useWidget } from '@/store/features/widgets';
import store from '@/store/store';
import { getConfigurable, getDuplicable } from '@/utils/widgets';
import EyeSlashIcon from 'bootstrap-icons/icons/eye-slash.svg';
import EyeIcon from 'bootstrap-icons/icons/eye.svg';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useContext, useMemo } from 'react';

export interface EditLayerProps {
  id: string;
}

export function EditingLayer ({ id }: EditLayerProps) {
  const { dashboardName } = useContext(DashboardContext);
  const deleteDashboardItem = useDeleteDashboardItem();
  const router = useRouter();
  const { name, isPrivate } = useLibraryItemField(id, ({ name, visibility }) => ({
    name,
    isPrivate: visibility !== 'public',
  }));

  const updateLibraryItem = useUpdateLibraryItem();
  const widget = useWidget(name);

  const { configurable, duplicable } = useMemo(() => {
    const configurable = widget ? getConfigurable(widget) : false;
    const duplicable = widget ? getDuplicable(widget) : false;
    return { configurable, duplicable };
  }, [widget]);

  const configureAction = useRefCallback(() => {
    startAppStateLoadingTransition(() => {
      router.push(`/widgets/${encodeURIComponent(id)}/edit`);
    });
  });

  const styleConfigureAction = useRefCallback(() => {
    startAppStateLoadingTransition(() => {
      router.push(`/widgets/${encodeURIComponent(id)}/styles`);
    });
  });

  const deleteAction = useRefCallback(() => {
    deleteDashboardItem(id);
  });

  const handleDuplicate = useRefCallback(() => {

    duplicateItem(id);
  });

  const handleVisibilityChange = useRefCallback(() => {
    updateLibraryItem(id, (item, ctx) => {
      if (item.visibility === 'public') {
        item.visibility = 'private';
      } else {
        item.visibility = 'public';
      }
      ctx.changedKeys = [`visibility`];
      return item;
    });
  });

  return (
    <div className='widget-layer editing-layer'>
      <div className="widget-toolbar-container">
        <ToolbarMenu
          className="widget-toolbar"
          data-layer-item
          items={(
            <>
              <MenuItem
                id="delete"
                text={<TrashIcon className="text-red-500" />}
                action={deleteAction}
                order={10000}
              />
              {duplicable && (
                <MenuItem
                  id="duplicate"
                  text={<DuplicateIcon fill="currentColor" />}
                  action={handleDuplicate}
                  order={0}
                />
              )}
              <MenuItem
                id="styles"
                text={<PaletteIcon />}
                action={styleConfigureAction}
                order={99}
              />
              {configurable && (
                <MenuItem
                  id="configure"
                  text={<PencilIcon fill="currentColor" />}
                  action={configureAction}
                  order={1}
                  disabled={!configurable}
                />
              )}
              <MenuItem
                id="visibility"
                text={isPrivate ? <EyeSlashIcon /> : <EyeIcon className="text-green-500" />}
                action={handleVisibilityChange}
                order={100}
              />
            </>
          )}
        >
        </ToolbarMenu>
      </div>
    </div>
  );
}

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}

function duplicateItem (id: string, props?: (props: any) => any) {
  const { library, dashboards } = store.getState();

  const item = library.items[id];
  if (!dashboards.current) {
    return;
  }
  const dashboard = dashboards.dashboards[dashboards.current];
  const oldItem = dashboard.items[id];
  if (dashboard && item && oldItem) {
    const prev = item;
    const prevProps = cloneJson(prev.props);
    const newItem = {
      id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
      name: prev.name,
      props: cloneJson(props?.(prevProps) ?? prevProps),
    };
    const newReference = {
      id: newItem.id,
      layout: cloneJson(oldItem.layout),
    };
    store.dispatch(libraryFeature.actions.add({ item: newItem }));
    store.dispatch(dashboardsFeature.actions.add({ item: newReference }));
  }
}

