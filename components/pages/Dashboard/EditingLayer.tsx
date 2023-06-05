import DuplicateIcon from '@/components/icons/copy.svg';
import PaletteIcon from '@/components/icons/palette.svg';
import PencilIcon from '@/components/icons/pencil.svg';
import TrashIcon from '@/components/icons/trash.svg';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { library, startAppStateLoadingTransition } from '@/core/bind';
import { useNullableDashboardItems } from '@/core/dashboard';
import { duplicateItem } from '@/core/helpers/items';
import widgets from '@/core/widgets-manifest';
import { move } from '@/packages/layout/src/core/types';
import { DraggableState } from '@/packages/layout/src/hooks/draggable';
import { MenuItem } from '@/packages/ui/components/menu';
import { ToolbarMenu } from '@/packages/ui/components/toolbar-menu';
import { useWatchItemField } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { getConfigurable, getDuplicable, getStyleConfigurable } from '@/utils/widgets';
import EyeSlashIcon from 'bootstrap-icons/icons/eye-slash.svg';
import EyeIcon from 'bootstrap-icons/icons/eye.svg';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useContext, useMemo } from 'react';

export interface EditLayerProps {
  id: string;
  draggableProps?: DraggableState<HTMLDivElement>['domProps'];
}

export function EditingLayer ({ id, draggableProps }: EditLayerProps) {
  const { dashboardName } = useContext(DashboardContext);
  const items = useNullableDashboardItems(dashboardName);
  const router = useRouter();
  const name = useWatchItemField('library', id, 'name');

  const { configurable, duplicable, styleConfigurable } = useMemo(() => {
    const widget = widgets[name];

    const configurable = widget ? getConfigurable(widget) : false;
    const duplicable = widget ? getDuplicable(widget) : false;
    const styleConfigurable = widget ? getStyleConfigurable(widget) : false;
    return { configurable, duplicable, styleConfigurable };
  }, [name]);

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
    items?.del(id);
  });

  const handleDuplicate = useRefCallback(() => {
    if (!dashboardName) {
      return;
    }
    duplicateItem(dashboardName, id, rect => move(rect, [1, 1]));
  });

  const handleVisibilityChange = useRefCallback(() => {
    library.update(id, (item, ctx) => {
      if (item.visibility === 'public') {
        item.visibility = 'private';
      } else {
        item.visibility = 'public';
      }
      ctx.changedKeys = [`visibility`];
      return item;
    });
  });

  const isPrivate = useWatchItemField('library', id, 'visibility') !== 'public';

  return (
    <div
      className={clsx('absolute left-0 top-0 w-full h-full z-10 text-white flex flex-col transition-colors')}
    >
      <div className="text-black transition-all">
        <ToolbarMenu
          className="flex justify-end items-center"
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
              {styleConfigurable && (
                <MenuItem
                  id="styles"
                  text={<PaletteIcon />}
                  action={styleConfigureAction}
                  order={99}
                />
              )}
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
      <div className="flex-1 justify-stretch cursor-pointer" {...draggableProps} />
    </div>
  );
}
