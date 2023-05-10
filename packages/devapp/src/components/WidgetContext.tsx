import WidgetContext from '@oss-widgets/ui/context/widget';
import { useContext } from 'react';

export const WidgetContextProvider = WidgetContext.Provider;

export function useWidgetContext () {
  return useContext(WidgetContext);
}
