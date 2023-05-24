import { MenuItem } from '@/packages/ui/components/menu';
import EditModeSwitch from '@/src/components/EditModeSwitch';
import { Consume } from '@/packages/ui/hooks/bind/types';
import PlusIcon from '@/src/icons/plus.svg';
import widgets, { Widget } from '@/src/widgets-manifest';
import { useLayoutManager } from '@/src/components/WidgetsManager';
import { useCallback } from 'react';
import { useNullableDashboardItems } from '@/src/core/dashboard';
import CloudDownloadIcon from '@/src/icons/cloud-download.svg';

export default function DashboardMenuItems ({ dashboardName, editMode, onEditModeUpdate }: { dashboardName: string, editMode: boolean, onEditModeUpdate: Consume<boolean> }) {
  const items = useNullableDashboardItems(dashboardName);
  const { download, newItem } = useLayoutManager({ dashboardName });

  const addModule = useCallback((name: string, widget: Widget) => {
    if (!items) {
      return;
    }
    widget.module()
      .then((module) => {
        console.log(module.defaultProps);

        if (items.has(name)) {
          const id = `${name}-${Math.round(Date.now() / 1000)}`;
          newItem({
            id,
            name,
            rect: module.defaultRect ?? [0, 0, 8, 3],
            props: module.defaultProps ?? {},
          });
        } else {
          newItem({
            name,
            rect: module.defaultRect ?? [0, 0, 8, 3],
            props: module.defaultProps ?? {},
          });
        }
      });
  }, [items]);

  return (
    <>
      {editMode && (
        <MenuItem text={<PlusIcon width={20} height={20} />} id="new" order={2} disabled={false} parent>
          {Object.entries(widgets).map(([k, v], index) => {
            return (
              <MenuItem id={k} key={k} order={index} text={k} disabled={false} action={() => {
                addModule(k, v);
              }} />
            );
          })}
        </MenuItem>
      )}
      <MenuItem id="EditModeSwitch" order={10} disabled={false} custom>
        <EditModeSwitch className="m-1" checked={editMode} onCheckedChange={onEditModeUpdate} />
      </MenuItem>
      <MenuItem id="DownloadLayoutJSON" order={100} action={download} text={<CloudDownloadIcon />} />
    </>
  );
}
