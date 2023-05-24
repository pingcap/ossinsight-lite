import { useWatchItemField, useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { MenuItem } from '@ossinsight-lite/ui/components/menu';
import { Component, ComponentType, forwardRef, ReactElement, Suspense, useContext, useState } from 'react';
import * as layoutComponents from '../../layout-components';
import widgets from '../../widgets-manifest';
import { useLayoutManager } from '../../components/WidgetsManager';
import { ComponentProps } from '@ossinsight-lite/layout/src/components/Components';
import { move } from '@ossinsight-lite/layout/src/core/types';
import clsx from 'clsx';
import { Menu } from '@ossinsight-lite/ui/components/menu/Menu';
import { Consume } from '@ossinsight-lite/ui/hooks/bind/types';
import { DashboardContext } from './context';
import { WidgetCoordinator } from './WidgetCoordinator';
import { useNullableDashboardItems } from '../../core/dashboard';
import { ToolbarMenu } from '@/packages/ui/components/toolbar-menu';
import DuplicateIcon from '@/src/icons/copy.svg';
import TrashIcon from '@/src/icons/trash.svg';
import { DraggableState } from '@/packages/layout/src/hooks/draggable';

export interface WidgetComponentProps extends ComponentProps, WidgetStateProps {
  className?: string;
}

export interface WidgetStateProps {
  editMode: boolean,
  active: boolean,
  onActiveChange: Consume<boolean>
}

type ResolvedComponentType = ComponentType<any>;

const internalCache: Record<string, ResolvedComponentType> = {};

export const WidgetComponent = forwardRef<HTMLDivElement, WidgetComponentProps>(({ ...componentProps }, ref) => {
  let el: ReactElement;

  const { id, draggable, dragging, draggableProps, editMode, active, onActiveChange, className, ...rest } = componentProps;

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
    <div className={clsx('widget relative rounded-lg bg-white bg-opacity-60 overflow-hidden', className)} {...rest}>
      <Menu name={`widgets.${id}`}>
        <WidgetComponentWrapper
          id={id}
          editMode={editMode}
          dragging={dragging}
          active={active}
          onActiveChange={onActiveChange}
          draggableProps={draggableProps}
        >
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xl text-gray-400">Loading</div>}>
            {el}
          </Suspense>
        </WidgetComponentWrapper>
      </Menu>
    </div>
  );
});
type WidgetState = {
  id: string
  editMode: boolean
  dragging: boolean
  draggableProps?: DraggableState<HTMLDivElement>['domProps']
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

export function EditingLayer ({ id, editMode, dragging, draggableProps, active, onActiveChange }: WidgetState) {
  const { dashboardName } = useContext(DashboardContext);
  const items = useNullableDashboardItems(dashboardName);
  const [hover, setHover] = useState(false);
  const { duplicateItem } = useLayoutManager({ dashboardName });

  const name = useWatchItemField('library', id, 'name');

  const deleteAction = useRefCallback(() => {
    items?.del(id);
  });

  const duplicateAction = useRefCallback(() => {
    duplicateItem(id, rect => move(rect, [1, 1]));
  });

  return (
    <div
      className={clsx('absolute left-0 top-0 w-full h-full z-10 bg-gray-700 bg-opacity-0 text-white flex flex-col transition-colors')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="text-black bg-black bg-opacity-0 opacity-20 hover:bg-opacity-30 hover:opacity-100 hover:text-white transition-all">
        <ToolbarMenu
          className="flex justify-end items-center"
          onMouseDown={e => console.log(e)}
          name={`widgets.${id}`}
          auto={false}
          data-layer-item
        >
          <MenuItem
            key="name"
            id="WidgetName"
            order={-1000}
            custom
          >
            <span className='text-sm'>
              {name}
            </span>
          </MenuItem>
          <MenuItem
            key="spacer"
            id="Spacer"
            order={-500}
            separator
          />
          <MenuItem
            key="duplicate"
            id="duplicate"
            text={<DuplicateIcon fill="currentColor" />}
            action={duplicateAction}
            order={0}
          />
          <MenuItem
            key="delete"
            id="delete"
            text={<TrashIcon className="text-red-500" />}
            action={deleteAction}
            order={100}
          />
        </ToolbarMenu>
      </div>
      <div className="flex-1 justify-stretch cursor-pointer" {...draggableProps} />
    </div>
  );
}
