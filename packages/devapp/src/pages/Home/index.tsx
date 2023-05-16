import Components from '@oss-widgets/layout/src/components/Components';
import GridLayout from '@oss-widgets/layout/src/components/GridLayout';
import { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import widgets, { Widget } from '../../widgets-manifest';
import EditModeSwitch from '../../components/EditModeSwitch';
import { Rect } from '@oss-widgets/layout/src/core/types';
import { MenuItem, MenuItemSlot } from '@oss-widgets/ui/components/menu';
import { useLayoutManager } from '../../components/WidgetsManager';
import { useCollection, useCollectionKeys, useReactBindCollections, useWatchItemField } from '@oss-widgets/ui/hooks/bind';
import { createWidgetComponent } from './createWidgetComponent';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import PlusIcon from '../../icons/plus.svg';

function Home () {
  const { dashboard: dashboardName = 'default' } = useParams<{ dashboard?: string }>();
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState<string>();
  const map = useMap<string, string>();

  const library = useCollection('library');
  const dashboard = useCollection(`dashboard.${dashboardName}.items`);
  const { download, newItem } = useLayoutManager({ dashboard, library });

  const itemIds = useCollectionKeys(dashboard) as string[];

  const useRect = useCallback((id: string) => {
    return useWatchItemField(`dashboard.${dashboardName}.items`, id, 'rect');
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

  const WidgetComponent = useMemo(() => memo(createWidgetComponent(library, dashboard), isPropsEquals(['onActiveChange'])), []);

  const navigate = useNavigate();

  return (
    <>
      {editMode && (
        <MenuItem text={<PlusIcon width={20} height={20} />} id="new" order={2} disabled={false} parent>
          {Object.entries(widgets).map(([k, v], index) => {
            return <MenuItem id={k} key={k} order={index} text={k} disabled={false} action={() => {
              addModule(k, v);
            }} />;
          })}
        </MenuItem>
      )}
      <GridLayout gridSize={40} gap={8} className="relative w-screen overflow-x-hidden h-[calc(100vh-40px)]" guideUi={editMode} onDrag={handleDrag}>
        <MenuItemSlot id="More">
          <MenuItem id="EditModeSwitch" order={-1} disabled={false} custom>
            <EditModeSwitch className="m-1" checked={editMode} onCheckedChange={setEditMode} />
          </MenuItem>
          <MenuItem id="DownloadLayoutJSON" order={100} action={download} text="Download layout.json" />
        </MenuItemSlot>
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
      <Registry />
    </div>
  );
}

function Registry () {
  const { dashboard: dashboardName = 'default' } = useParams<{ dashboard?: string }>();
  const collections = useReactBindCollections();

  useEffect(() => {
    if (!collections.has(`dashboard.${dashboardName}.items`)) {
      const c = collections.add(`dashboard.${dashboardName}.items`);
      c.needLoaded();
    }
  });

  return null;
}

const isPropsEquals = <T extends Record<string, any>> (ignores: (keyof T)[] = []) => {
  const ignoresSet = new Set(ignores);
  return (a: T, b: T) => {
    const aKeys = Object.keys(a).filter(k => !ignoresSet.has(k));
    const bKeys = Object.keys(b).filter(k => !ignoresSet.has(k));

    if (aKeys.length !== bKeys.length) {
      return false;
    }
    for (let aKey of aKeys) {
      if (a[aKey] !== b[aKey]) {
        return false;
      }
    }
    return true;
  };
};
