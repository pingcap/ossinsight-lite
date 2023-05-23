import { createContext } from 'react';

export type WidgetContextValues = {
  enabled: boolean
  configurable: boolean
  editingLayout: boolean,
  props: any
  configure: string
  configuring: boolean
  onPropChange: (name: string, value: any) => void
}

const WidgetContext = createContext<WidgetContextValues>({
  enabled: false,
  configurable: false,
  editingLayout: false,
  props: {},
  configure: '',
  configuring: false,
  onPropChange: () => {},
});

export default WidgetContext;
