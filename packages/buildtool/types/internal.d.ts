// TODO: wrong type definition
declare module 'widgets:config' {
  import type { Config } from '@oss-widgets/buildtool/dist/utils/config';

  const config: Config;
  export default config;
}

declare module 'widgets:layout' {
  const layout: any;
  export default layout;

  export function save (layout: any): any;
}
