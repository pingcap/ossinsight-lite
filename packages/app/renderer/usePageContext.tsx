// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import { createContext, ReactNode, useContext } from 'react';
import type { PageContext } from './types'

export { PageContextProvider }
export { usePageContext }

const Context = createContext<PageContext>(undefined as any)

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: ReactNode }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
