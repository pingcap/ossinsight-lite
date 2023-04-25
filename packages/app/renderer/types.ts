import type { PageContextBuiltIn, PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient } from 'vite-plugin-ssr/types';

export type { PageContextServer };
export type { PageContextClient };
export type { PageContext };
export type { PageProps };

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = {}

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  urlPathname: string
  exports: {
    documentProps?: {
      title?: string
      description?: string
    }
  }
  errorWhileRendering: any
}

type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContext = PageContextClient | PageContextServer
