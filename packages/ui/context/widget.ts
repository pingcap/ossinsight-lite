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
  creating: boolean
  onPropChange: (name: string, value: any) => void
}

const WidgetContext = createContext<WidgetContextValues>({
  enabled: false,
  configurable: false,
  editingLayout: false,
  props: {},
  configuring: false,
  creating: false,
  onPropChange: () => {},
});

export default WidgetContext;
