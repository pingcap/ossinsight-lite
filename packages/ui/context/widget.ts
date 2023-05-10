import { createContext } from 'react';

export type WidgetContextValues = {
  enabled: boolean
  configurable: boolean
  props: any
  configure (): void
  onPropChange: (name: string, value: any) => void
}

const WidgetContext = createContext<WidgetContextValues>({
  enabled: false,
  configurable: false,
  props: {},
  configure () {},
  onPropChange: () => {},
});

export default WidgetContext;
