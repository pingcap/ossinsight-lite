import { createContext, useContext } from 'react';

const Context = createContext<{
  props: any,
  onPropChange: (name: string, value: any) => void,
}>({
  props: {},
  onPropChange: () => {},
});

export const WidgetContext = Context.Provider;

export function useWidgetContext () {
  return useContext(Context);
}
