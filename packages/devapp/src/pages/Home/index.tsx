import Components from '@oss-widgets/layout/src/components/Components';
import GridLayout from '@oss-widgets/layout/src/components/GridLayout';
import { memo, Suspense, useCallback, useMemo, useState } from 'react';
import widgets, { Widget } from '../../widgets-manifest';
import EditModeSwitch from '../../components/EditModeSwitch';
import { Rect } from '@oss-widgets/layout/src/core/types';
import { MenuItem } from '@oss-widgets/ui/components/menu';
import { useLayoutManager } from '../../components/WidgetsManager';
import { useCollection, useCollectionKeys, useWatchItemField } from '@oss-widgets/ui/hooks/bind';
import { NavMenu } from '@oss-widgets/ui/components/nav-menu';
import { createWidgetComponent } from './createWidgetComponent';

function Home () {
  const { download, newItem } = useLayoutManager();
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState<string>();
  const map = useMap<string, string>();

  const library = useCollection('library');
  const dashboard = useCollection('dashboard.default.items');

  const itemIds = useCollectionKeys(dashboard) as string[];

  const useRect = useCallback((id: string) => {
    return useWatchItemField('dashboard.default.items', id, 'rect');
  }, []);

  const handleDrag = useCallback(async (id: string, rect: Rect) => {
    const externalId = map.get(id);
    if (!externalId) {
      return;
    }
    dashboard.update(externalId, item => {
      item.rect = rect;
      return item;
    });
  }, []);

  const addModule = useCallback((name: string, widget: Widget) => {
    Promise.all([widget.module(), dashboard])
      .then(([module]) => {
        const id = `${name}-${Math.round(Date.now() / 1000)}`;
        newItem({
          id,
          name,
          rect: [0, 0, 8, 3],
          props: module.defaultProps ?? {},
        });
      });
  }, []);

  const WidgetComponent = useMemo(() => memo(createWidgetComponent(library), (a, b) => {
    return a.active === b.active && a.editMode === b.editMode && a.id === b.id && a.draggable === b.draggable && a.dragging === b.dragging;
  }), []);

  return (
    <>
      {editMode && <NavMenu name="nav" className="h-[40px] fixed left-0 top-0 p-[4px] min-w-[250px]">
        <MenuItem text="New" id="new" group={0} order={0} disabled={false}>
          {Object.entries(widgets).map(([k, v]) => {
            return {
              id: k,
              disabled: false,
              text: k,
              action: () => {
                addModule(k, v);
              },
            };
          })}
        </MenuItem>
      </NavMenu>}
      <GridLayout gridSize={40} gap={8} className="relative top-[48px] w-screen h-[calc(100vh-48px)]" guideUi={editMode} onDrag={handleDrag}>
        <EditModeSwitch className="absolute right-1 top-1" checked={editMode} onCheckedChange={setEditMode} />
        <button className="absolute right-1 top-8" onClick={download}>Download layout.json</button>
        <Components
          itemIds={itemIds}
          draggable={editMode}
          idMap={map}
          useRect={useRect}
          wrap={el => <Suspense fallback={<>loading item</>} key={el.key}>{el}</Suspense>}
          commonProps={id => ({
            editMode,
            active: active === id,
            wrapperClassName: active === id ? 'active' : undefined,
            onActiveChange: (open) => {
              setActive(active => {
                if (open) {
                  return id;
                } else if (active === id) {
                  return undefined;
                }
              });
            },
          })}
          Component={WidgetComponent}
        />
      </GridLayout>
    </>
  );
}

export function useMap<K, V> () {
  const [map] = useState(() => new Map<K, V>());
  return map;
}

export default function () {
  return (
    <div id="home-page">
      <Suspense fallback="Home Loading...">
        <Home />
      </Suspense>
    </div>
  );
}
