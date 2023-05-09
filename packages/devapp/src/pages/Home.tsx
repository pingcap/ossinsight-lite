import Components from '@oss-widgets/layout/src/components/Components';
import GridLayout from '@oss-widgets/layout/src/components/GridLayout';
import { ComponentType, HTMLProps, lazy, ReactElement, Suspense, useCallback, useState } from 'react';
import widgets from '../widgets-manifest';
import * as layoutComponents from '../layout-components';
import layout, { save } from 'widgets:layout';
import EditModeSwitch from '../components/EditModeSwitch';
import { Rect } from '@oss-widgets/layout/src/core/types';
import RoughSvg from '@oss-widgets/roughness/components/RoughSvg';
import PencilIcon from '../icons/pencil.svg';
import { Link } from 'react-router-dom';

export default function Home () {
  const [editMode, setEditMode] = useState(false);
  const map = useMap<string, string>();

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

  return (
    <GridLayout gridSize={40} gap={8} width="100vw" height="100vh" guideUi={editMode} onDrag={handleDrag}>
      <EditModeSwitch className="absolute right-1 top-1" checked={editMode} onCheckedChange={setEditMode} />
      <Components items={layout} render={render} draggable={editMode} idMap={map} />
    </GridLayout>
  );
}

type ResolvedComponentType = ComponentType<any>;
const cache: Record<string, ResolvedComponentType> = {};

function render (id: string, name: string, props: Record<string, any> | undefined, draggable: boolean): ReactElement {
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
      const C: ResolvedComponentType = module.default;
      const configurable = module.configurable;
      return {
        default: cache[name] = ({ _id: id, draggable, ...props }: any) => (
          <>
            {draggable && configurable && (
              <Link className="absolute right-0.5 top-0.5 z-10" data-layer-item to={`/edit/${encodeURIComponent(id)}`}>
                <RoughSvg>
                  <PencilIcon width="1em" height="1em" />
                </RoughSvg>
              </Link>
            )}
            <C {...props} />
          </>
        ),
      };
    })) as any;
  }

  return (
    <div className="widget relative">
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
