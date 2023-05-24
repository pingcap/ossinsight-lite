import { createContext } from 'react';

type VisualizeContextValues = {
  columns?: { name: string }[] | undefined
  running: boolean
  result: any | undefined
  error: unknown
  portal?: HTMLDivElement | undefined
}

export const VisualizeContext = createContext<VisualizeContextValues>({
  columns: undefined,
  running: false,
  result: undefined,
  error: undefined,
  portal: undefined,
});

