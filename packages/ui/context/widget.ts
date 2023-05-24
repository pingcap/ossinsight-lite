import { ComponentType, createContext } from 'react';

export type WidgetContextValues = {
  /** deprecated */
  enabled: boolean
  /** deprecated */
  configurable: boolean,
  /** deprecated */
  editingLayout: boolean,
  props: any
  configuring: boolean
  onPropChange: (name: string, value: any) => void
}

const WidgetContext = createContext<WidgetContextValues>({
  enabled: false,
  configurable: false,
  editingLayout: false,
  props: {},
  configuring: false,
  onPropChange: () => {},
});

export default WidgetContext;
