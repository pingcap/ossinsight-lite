import { useCollection, useWatchItemFields } from '@oss-widgets/ui/hooks/bind';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { MenuItem } from '@oss-widgets/ui/components/menu';
import { Component, ComponentType, forwardRef, ReactElement, Suspense, useContext, useState } from 'react';
import * as layoutComponents from '../../layout-components';
import widgets from '../../widgets-manifest';
import { useLayoutManager } from '../../components/WidgetsManager';
import { ComponentProps } from '@oss-widgets/layout/src/components/Components';
import { move } from '@oss-widgets/layout/src/core/types';
import clsx from 'clsx';
import { Menu } from '@oss-widgets/ui/components/menu/Menu';
import { ContextMenu } from '@oss-widgets/ui/components/context-menu';
import { Consume } from '@oss-widgets/ui/hooks/bind/types';
import { DashboardContext } from './context';
import { WidgetCoordinator } from './WidgetCoordinator';

export interface WidgetComponentProps extends ComponentProps, WidgetStateProps {

}

export interface WidgetStateProps {
  editMode: boolean,
  active: boolean,
  onActiveChange: Consume<boolean>
}

export function createWidgetComponent () {
  type ResolvedComponentType = ComponentType<any>;
  const internalCache: Record<string, ResolvedComponentType> = {};

  return forwardRef<HTMLDivElement, WidgetComponentProps>(({ ...componentProps }, ref) => {
    let el: ReactElement;

    const { id, draggable, dragging, editMode, active, onActiveChange, ...rest } = componentProps;

    const { props: itemProps, name } = useWatchItemFields('library', id, ['name', 'props']);
    const props = { ...rest, ...itemProps };

    if (name.startsWith('internal:')) {
      let Component: ResolvedComponentType;
      const componentName = name.split(':')[1];

      Component = internalCache[componentName];
      if (!Component) {
        Component = internalCache[componentName] = forwardRef((layoutComponents as any)[componentName]);
      }
      el = <Component _id={id} {...props} className={clsx('w-full h-full', props.className)} />;
    } else {
      if (!widgets[name]) {
        throw new Error(`Unknown widget ${name}`);
      }

      el = <WidgetCoordinator name={name} _id={id} editMode={editMode} draggable={draggable} props={{ ...props, className: clsx('w-full h-full', props.className) }} ref={ref} />;
    }

    return (
      <div className="widget relative rounded-lg shadow bg-white bg-opacity-60 overflow-hidden" {...rest}>
        <Menu name={`widgets.${id}`}>
          <WidgetComponentWrapper
            id={id}
            editMode={editMode}
            dragging={dragging}
            active={active}
            onActiveChange={onActiveChange}
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xl text-gray-400">Loading</div>}>
              {el}
            </Suspense>
          </WidgetComponentWrapper>
        </Menu>
      </div>
    );
  });
}

type WidgetState = {
  id: string
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

export function EditingLayer ({ id, editMode, dragging, active, onActiveChange }: WidgetState) {
  const { dashboardName } = useContext(DashboardContext);
  const dashboard = useCollection(`dashboard.${dashboardName}.items`);
  const [hover, setHover] = useState(false);
  const library = useCollection('library');
  const { duplicateItem } = useLayoutManager({ dashboard, library });

  const deleteAction = useRefCallback(() => {
    dashboard.del(id);
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
        order={0}
        disabled={false}
      />
      <MenuItem
        key="delete"
        id="delete"
        text={<span className="text-red-400">Delete</span>}
        action={deleteAction}
        order={1}
        disabled={false}
      />
    </ContextMenu>
  );
}
