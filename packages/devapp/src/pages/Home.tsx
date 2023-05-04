import Components, { Item } from '@oss-widgets/layout/src/components/Components';
import GridLayout from '@oss-widgets/layout/src/components/GridLayout';
import { ComponentType, HTMLProps, lazy, ReactElement, Suspense } from 'react';
import widgets from '../widgets-manifest';
import * as layoutComponents from '../layout-components';

export default function Home () {
  return (
    <GridLayout gridSize={40} gap={8} width="100vw" height="100vh" guideUi>
      <Components items={items} render={render} draggable />
    </GridLayout>
  );
}

const items: Item[] = [{
  name: 'internal:Navigator',
  rect: [-12, -5, 4, 1],
}, {
  name: 'internal:Title',
  rect: [-2, -7, 4, 4],
}, {
  name: 'github/recent-events',
  rect: [4, -4, 8, 4],
}, {
  name: 'oh-my-github/personal-overview',
  rect: [-12, -4, 16, 8],
}, {
  name: 'ossinsight/total-events',
  rect: [-12, -6, 4, 1],
},
];

const cache: Record<string, ComponentType<HTMLProps<any>>> = {};

function render (name: string, props?: Record<string, any>): ReactElement {
  let Component: ComponentType<HTMLProps<any>>;
  if (name.startsWith('internal:')) {
    const componentName = name.split(':')[1];
    Component = (layoutComponents as any)[componentName];
    return <Component {...props} />;
  }

  Component = cache[name];
  if (!Component) {
    const widget = widgets[name];
    if (!widget) {
      throw new Error(`Unknown widget ${name}`);
    }
    Component = lazy(widget.module) as any;
  }

  return (
    <div className="widget" {...props}>
      <Suspense fallback="loading...">
        <Component style={{ width: '100%', height: '100%' }} />
      </Suspense>
    </div>
  );
}
