import { PropsWithChildren } from 'react';

export default function ClientOnly ({ children }: PropsWithChildren) {
  if (import.meta.env.SSR) {
    return <></>
  } else {
    return <>{children}</>
  }
}