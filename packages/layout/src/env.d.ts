declare module '*.svg' {
  import type { ComponentProps, RefAttributes } from 'react';

  const ReactComponent: React.FunctionComponent<
    ComponentProps<'svg'> & { title?: string } & RefAttributes<SVGSVGElement>
  >;

  export default ReactComponent;
}
