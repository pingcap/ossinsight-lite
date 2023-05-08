import Components, { Item } from '@oss-widgets/layout/src/components/Components';
import GridLayout from '@oss-widgets/layout/src/components/GridLayout';
import { ComponentType, HTMLProps, lazy, ReactElement, Suspense } from 'react';
import widgets from '../widgets-manifest';
import * as layoutComponents from '../layout-components';
import layout from 'widgets:layout';

export default function Home () {
  return (
    <GridLayout gridSize={40} gap={8} width="100vw" height="100vh" guideUi>
      <Components items={layout} render={render} draggable />
    </GridLayout>
  );
}

const cache: Record<string, ComponentType<HTMLProps<any>>> = {};

function render (name: string, props?: Record<string, any>): ReactElement {
  console.log(props);
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
    <div className="widget">
      <Suspense fallback="loading...">
        <Component style={{ width: '100%', height: '100%' }} {...props} />
      </Suspense>
    </div>
  );
}
