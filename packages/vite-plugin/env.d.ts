declare module 'app:widgets-manifest' {
  import { Widgets } from 'widgets-vite-plugin/types/widget';

  const widgets: Widgets;

  export default widgets;
}

declare module '*.sql' {
  type RawPacket = any
  const result: RawPacket[];

  export default result;
}

declare module '*.sql?unique' {
  type RawPacket = any
  const result: RawPacket;

  export default result;
}
