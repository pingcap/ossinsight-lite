declare module '*.svg' {
  import { ExoticComponent, SVGAttributes } from 'react';

  const SvgIcon: ExoticComponent<SVGAttributes<SVGSVGElement>>;

  export default SvgIcon;
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
