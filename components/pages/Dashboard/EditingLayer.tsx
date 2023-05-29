import DuplicateIcon from '@/components/icons/copy.svg';
import PaletteIcon from '@/components/icons/palette.svg';
import PencilIcon from '@/components/icons/pencil.svg';
import TrashIcon from '@/components/icons/trash.svg';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { startAppStateLoadingTransition } from '@/core/bind';
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

  return (
    <div
      className={clsx('absolute left-0 top-0 w-full h-full z-10 bg-gray-700 bg-opacity-0 text-white flex flex-col transition-colors')}
    >
      <div className="text-black bg-black bg-opacity-0 opacity-20 hover:bg-opacity-30 hover:opacity-100 hover:text-white transition-all">
        <ToolbarMenu
          className="flex justify-end items-center"
          data-layer-item
          items={(
            <>
              <MenuItem
                id="delete"
                text={<TrashIcon className="text-red-500" />}
                action={deleteAction}
                order={100}
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
            </>
          )}
        >
        </ToolbarMenu>
      </div>
      <div className="flex-1 justify-stretch cursor-pointer" {...draggableProps} />
    </div>
  );
}
