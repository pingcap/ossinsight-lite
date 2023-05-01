import * as React from 'react';
import { RefAttributes } from 'react';

declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'> & { title?: string } & RefAttributes<SVGSVGElement>
  >;

  export default ReactComponent;
}

declare global {
  type Process = {
    env: {
      [key: string]: string
      NODE_ENV: 'production' | 'development'
      OSSW_SITE_DOMAIN: string
    }
  }

  export const process: Process;
}

export {};
