import Components from '@oss-widgets/layout/src/components/Components';
import GridLayout from '@oss-widgets/layout/src/components/GridLayout';
import { ComponentType, forwardRef, lazy, Suspense, useCallback, useMemo, useState } from 'react';
import widgets, { Widget } from '../widgets-manifest';
import * as layoutComponents from '../layout-components';
import EditModeSwitch from '../components/EditModeSwitch';
import { move, Rect } from '@oss-widgets/layout/src/core/types';
import { ContextMenu, ContextMenuItem } from '@oss-widgets/ui/components/context-menu';
import { WidgetContextProvider } from '../components/WidgetContext';
import { useNavigate } from 'react-router-dom';
import { useLayoutManager } from '../components/LayoutManager';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';

export default function Home () {
  const { items, updateItemRect, updateItemProps, addItem, removeItem, duplicateItem, useRectNotify, usePropsNotify, download, useItem } = useLayoutManager();
  const [editMode, setEditMode] = useState(process.env.NODE_ENV === 'development');
  const map = useMap<string, string>();

  const handleDrag = useCallback((id: string, rect: Rect) => {
    const externalId = map.get(id);
    if (!externalId) {
      return;
    }
    updateItemRect(externalId, rect);
  }, []);

  const addModule = useCallback((name: string, widget: Widget) => {
    widget.module().then(module => {
      addItem(`${name}-${Math.round(Date.now() / 1000)}`, name, [0, 0, 8, 3], module.defaultProps ?? {});
    });
  }, []);

  const deleteWidget = useCallback((id: string) => {
    removeItem(id);
  }, []);

  const duplicateWidget = useCallback((id: string) => {
    duplicateItem(id, rect => move(rect, [1, 1]));
  }, []);

  return (
    <ContextMenu
      trigger={
        <div data-x-context-menu-trigger={true}> {/* TODO: ContextMenu to GridLayout not work. */}
          <GridLayout gridSize={40} gap={8} width="100vw" height="100vh" guideUi={editMode} onDrag={handleDrag}>
            <EditModeSwitch className="absolute right-1 top-1" checked={editMode} onCheckedChange={setEditMode} />
            <button className="absolute right-1 top-8" onClick={download}>Download layout.json</button>
            <Components
              items={items}
              draggable={editMode}
              idMap={map}
              useHooks={runAll(useRectNotify, usePropsNotify)}
            >
              {useCallback(({ id, name, props: inProps, draggable, ...rest }) => {
                let Component: ResolvedComponentType;

                // TODO: dirty fix: use passed in props do not updates.
                const item = useItem(id);
                const props = { ...inProps, ...rest, ...item?.props };

                const deleteAction = useRefCallback(() => {
                  deleteWidget(id);
                });

                const duplicateAction = useRefCallback(() => {
                  duplicateWidget(id);
                });

                const menu = useMemo(() => {
                  return (
                    <>
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
                    </>
                  );
                }, []);

                if (name.startsWith('internal:')) {
                  const componentName = name.split(':')[1];
                  Component = (layoutComponents as any)[componentName];

                  return (
                    <ContextMenu
                      trigger={<Component _id={id} {...props} />}
                    >
                      {menu}
                    </ContextMenu>
                  );
                }

                Component = cache[name];
                if (!Component) {
                  const widget = widgets[name];
                  if (!widget) {
                    throw new Error(`Unknown widget ${name}`);
                  }

                  cache[name] = Component = lazy(() => widget.module().then(module => {
                    const WidgetComponent = forwardRef(module.default);
                    const configurable = module.configurable ?? false;

                    return {
                      default: forwardRef(({ _id: id, draggable, ...props }: any, ref) => {
                        usePropsNotify(id);

                        const navigate = useNavigate();

                        const configure = useCallback(() => {
                          navigate(`/edit/${encodeURIComponent(id)}`);
                        }, []);

                        const onPropChange = useRefCallback((key: string, value: any) => {
                          updateItemProps(id, (props: any) => ({ ...props, [key]: value }));
                        });

                        return (
                          <WidgetContextProvider
                            value={{
                              enabled: true,
                              editingLayout: editMode,
                              configurable,
                              onPropChange,
                              props,
                              configure,
                            }}
                          >
                            <ContextMenu
                              trigger={<WidgetComponent {...props} ref={ref} />}
                            >
                              {menu}
                            </ContextMenu>
                          </WidgetContextProvider>
                        );
                      }),
                    };
                  })) as any;
                }

                return (
                  <div className="widget relative bg-white" {...rest}>
                    <Suspense fallback="loading...">
                      <>
                        <Component style={{ width: '100%', height: '100%' }} {...props} _id={id} draggable={draggable} />
                      </>
                    </Suspense>
                  </div>
                );
              }, [])}
            </Components>
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

export function useMap<K, V> () {
  const [map] = useState(() => new Map<K, V>());
  return map;
}

function runAll (...func: ((id: string) => any)[]): (id: string) => void {
  return ((id) => {
    func.forEach(f => f(id));
  });
}
