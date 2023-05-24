import { createContext, useContext } from 'react';

class WidgetCache {

}

export const WidgetCacheContext = createContext(new WidgetCache());

export function useWidgetCache () {
  return useContext(WidgetCacheContext);
}
