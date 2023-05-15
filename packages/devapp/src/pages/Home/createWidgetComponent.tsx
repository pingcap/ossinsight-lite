import { useWatchItemFields } from '@oss-widgets/ui/hooks/bind';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { MenuItem } from '@oss-widgets/ui/components/menu';
import { ComponentType, forwardRef, lazy, ReactElement, Suspense, useCallback, useState } from 'react';
import * as layoutComponents from '../../layout-components';
import widgets from '../../widgets-manifest';
import { useNavigate } from 'react-router-dom';
import { WidgetContextProvider } from '../../components/WidgetContext';
import { ReactBindCollection } from '@oss-widgets/ui/hooks/bind/ReactBindCollection';
import { useLayoutManager } from '../../components/WidgetsManager';
import { ComponentProps } from '@oss-widgets/layout/src/components/Components';
import { move } from '@oss-widgets/layout/src/core/types';
import clsx from 'clsx';
import { Menu } from '@oss-widgets/ui/components/menu/Menu';
import { ContextMenu } from '@oss-widgets/ui/components/context-menu';
import { Consume } from '@oss-widgets/ui/hooks/bind/types';
import { LibraryItem } from '../../types/config';

export function createWidgetComponent (library: ReactBindCollection<LibraryItem>) {
  type ResolvedComponentType = ComponentType<any>;
  const cache: Record<string, ResolvedComponentType> = {};

  return ({ ...componentProps }: ComponentProps & { editMode: boolean, active: boolean, onActiveChange: Consume<boolean> }) => {
    let Component: ResolvedComponentType;

    const { id, draggable, dragging, editMode, active, onActiveChange, ...rest } = componentProps;
    const passThroughProps = { draggable, dragging, editMode, active, onActiveChange };

    const { props: itemProps, name } = useWatchItemFields('library', id, ['name', 'props']);
    const props = { ...rest, ...itemProps };

    if (name.startsWith('internal:')) {
      const componentName = name.split(':')[1];
      Component = forwardRef((layoutComponents as any)[componentName]);

      return (
        <Menu name={`widgets.${id}`}>
          <WidgetComponentWrapper
            id={id}
            library={library}
            editMode={editMode}
            dragging={dragging}
            active={active}
            onActiveChange={onActiveChange}
          >
            <Component _id={id} {...props} />
          </WidgetComponentWrapper>
        </Menu>
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
          default: forwardRef(({ _id: id, draggable, dragging, editMode, active, onActiveChange, ...passInProps }: any, ref) => {
            const navigate = useNavigate();

            const { props: watchingProps } = useWatchItemFields('library', id, ['props']);

            const props = { ...passInProps, ...watchingProps };


            const configureAction = useCallback(() => {
              navigate(`/edit/${encodeURIComponent(id)}`);
            }, []);

            const onPropChange = useRefCallback((key: string, value: any) => {
              library.update(id, (item) => {
                item.props = { ...item.props, [key]: value };
                return item
              });
            });

            return (
              <WidgetContextProvider
                value={{
                  enabled: true,
                  editingLayout: editMode,
                  configurable,
                  onPropChange,
                  props,
                  configure: configureAction,
                }}
              >
                <Menu name={`widgets.${id}`}>
                  <WidgetComponentWrapper
                    id={id}
                    library={library}
                    editMode={editMode}
                    dragging={dragging}
                    active={active}
                    onActiveChange={onActiveChange}
                  >
                    <WidgetComponent {...props} ref={ref} />
                  </WidgetComponentWrapper>
                </Menu>
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
            <Component style={{ width: '100%', height: '100%' }} {...props} {...passThroughProps} _id={componentProps.id} />
          </>
        </Suspense>
      </div>
    );
  };
}

type WidgetState = {
  id: string
  library: ReactBindCollection<LibraryItem>,
  editMode: boolean
  dragging: boolean
  active: boolean
  onActiveChange: Consume<boolean>;
}

function WidgetComponentWrapper ({ children, ...props }: WidgetState & { children: ReactElement }) {
  if (props.editMode) {
    return (
      <div className="relative w-full h-full">
        {children}
        <EditingLayer
          {...props}
        />
      </div>
    );
  } else {
    return children;
  }
}

export function EditingLayer ({ id, editMode, dragging, library, active, onActiveChange }: WidgetState) {
  const [hover, setHover] = useState(false);
  const { duplicateItem } = useLayoutManager();

  const deleteAction = useRefCallback(() => {
    library.del(id);
  });

  const duplicateAction = useRefCallback(() => {
    duplicateItem(id, rect => move(rect, [1, 1]));
  });

  return (
    <ContextMenu
      name={`widgets.${id}`}
      auto={false}
      onOpenChange={onActiveChange}
      trigger={(
        <div
          className={clsx('absolute left-0 top-0 w-full h-full z-10 bg-gray-700 bg-opacity-0 text-white flex transition-colors', editMode && (dragging || hover || active) && '!bg-opacity-[0.7]')}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}
    >
      <MenuItem
        key="duplicate"
        id="duplicate"
        text="Duplicate"
        action={duplicateAction}
        group={0}
        order={0}
        disabled={false}
      />
      <MenuItem
        key="delete"
        id="delete"
        text={<span className="text-red-400">Delete</span>}
        action={deleteAction}
        order={0}
        group={1}
        disabled={false}
      />
    </ContextMenu>
  );
}
