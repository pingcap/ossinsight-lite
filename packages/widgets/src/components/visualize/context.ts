import { createContext } from 'react';

type VisualizeContextValues = {
  columns?: { name: string }[] | undefined
  selectedColumns?: string[] | undefined
  running: boolean
  result: any | undefined
  error: unknown
  portal?: HTMLDivElement | undefined
}

export const VisualizeContext = createContext<VisualizeContextValues>({
  columns: undefined,
  selectedColumns: undefined,
  running: false,
  result: undefined,
  error: undefined,
  portal: undefined,
});

