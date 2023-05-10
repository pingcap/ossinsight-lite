import Components from '@oss-widgets/layout/src/components/Components';
import GridLayout from '@oss-widgets/layout/src/components/GridLayout';
import { ComponentType, forwardRef, lazy, ReactElement, Suspense, useCallback, useMemo, useState } from 'react';
import widgets, { Widget } from '../widgets-manifest';
import * as layoutComponents from '../layout-components';
import layout, { save } from 'widgets:layout';
import EditModeSwitch from '../components/EditModeSwitch';
import { Rect } from '@oss-widgets/layout/src/core/types';
import { ContextMenu, ContextMenuItem } from '@oss-widgets/ui/components/context-menu';
import { WidgetContextProvider } from '../components/WidgetContext';
import { useNavigate } from 'react-router-dom';

export default function Home () {
  const [editMode, setEditMode] = useState(process.env.NODE_ENV === 'development');
  const map = useMap<string, string>();
  // TODO: add manage layout
  const [version, setVersion] = useState(0);

  const handleDrag = useCallback((id: string, rect: Rect) => {
    const externalId = map.get(id);
    if (!externalId) {
      return;
    }
    const item = layout.find((item: any) => item.id === externalId) ?? layout.find((item: any) => item.name === externalId);
    if (!item) {
      return;
    }
    item.rect = rect;

    save(layout);
  }, []);

  const addModule = useCallback((name: string, widget: Widget) => {
    widget.module().then(module => {
      const newWidgetInstance = {
        id: `${name}-${Math.round(Date.now() / 1000)}`,
        name: name,
        rect: [0, 0, 8, 3],
        props: module.defaultProps ?? {},
      };
      layout.push(newWidgetInstance);
      save(layout);
      setVersion(v => v + 1);
    });
  }, []);

  const deleteWidget = useCallback((id: string) => {
    layout.splice(layout.findIndex((item: any) => item.id === id || item.name === id), 1);
    save(layout);
    setVersion(v => v + 1);
  }, []);

  const duplicateWidget = useCallback((id: string) => {
    const index = layout.findIndex((item: any) => item.id === id || item.name === id);
    if (index === -1) {
      return;
    }
    const item = { ...layout[index], id: `${layout[index].name}-${Math.round(Date.now() / 1000)}` };
    item.rect = [...item.rect];
    item.props = JSON.parse(JSON.stringify(item.props));
    item.rect[0] += 1;
    item.rect[1] += 1;

    layout.splice(index + 1, 0, item);
    save(layout);
    setVersion(v => v + 1);
  }, []);

  const renderFunc = useMemo(() => {
    return render.bind({ deleteWidget, duplicateWidget });
  }, []);

  return (
    <ContextMenu
      trigger={
        <div data-x-context-menu-trigger={true}> {/* TODO: ContextMenu to GridLayout not work. */}
          <GridLayout gridSize={40} gap={8} width="100vw" height="100vh" guideUi={editMode} onDrag={handleDrag}>
            <EditModeSwitch className="absolute right-1 top-1" checked={editMode} onCheckedChange={setEditMode} />
            <Components items={layout} render={renderFunc} draggable={editMode} idMap={map} />
          </GridLayout>
        </div>
      }
    >
      <ContextMenuItem text="New" id="new">
        {Object.entries(widgets).map(([k, v]) => {
          return {
            key: k,
            disabled: false,
            text: k,
            action: () => {
              addModule(k, v);
            },
          };
        })}
      </ContextMenuItem>
    </ContextMenu>
  );
}

type ResolvedComponentType = ComponentType<any>;
const cache: Record<string, ResolvedComponentType> = {};

function render (this: { deleteWidget: (id: string) => void, duplicateWidget: (id: string) => void }, id: string, name: string, props: Record<string, any> | undefined, draggable: boolean): ReactElement {
  let Component: ResolvedComponentType;
  if (name.startsWith('internal:')) {
    const componentName = name.split(':')[1];
    Component = (layoutComponents as any)[componentName];
    return <Component _id={id} {...props} />;
  }

  Component = cache[name];
  if (!Component) {
    const widget = widgets[name];
    if (!widget) {
      throw new Error(`Unknown widget ${name}`);
    }

    Component = lazy(() => widget.module().then(module => {
      const C = forwardRef(module.default);
      const configurable = module.configurable ?? false;

      return {
        default: cache[name] = forwardRef(({ _id: id, draggable, ...props }: any, ref) => {
          const navigate = useNavigate();

          const configure = useCallback(() => {
            navigate(`/edit/${encodeURIComponent(id)}`);
          }, []);

          const deleteAction = useCallback(() => {
            this.deleteWidget(id);
          }, [id]);

          const duplicateAction = useCallback(() => {
            this.duplicateWidget(id);
          }, [id]);

          return <WidgetContextProvider value={{
            enabled: true,
            configurable,
            onPropChange: () => {},
            props: props,
            configure: configure,
          }}>
            <ContextMenu
              trigger={<C {...props} ref={ref} />}
            >
              <ContextMenuItem
                key="duplicate"
                id="duplicate"
                text="Duplicate"
                action={duplicateAction}
                order={0}
              />
              <ContextMenuItem
                key="delete"
                id="delete"
                text={<span className="text-red-400">Delete</span>}
                action={deleteAction}
                order={0}
                group={1}
              />
            </ContextMenu>
          </WidgetContextProvider>;
        }),
      };
    })) as any;
  }

  return (
    <div className="widget relative bg-white">
      <Suspense fallback="loading...">
        <>
          <Component style={{ width: '100%', height: '100%' }} {...props} _id={id} draggable={draggable} />
        </>
      </Suspense>
    </div>
  );
}

export function useMap<K, V> () {
  const [map] = useState(() => new Map<K, V>());
  return map;
}
