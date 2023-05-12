import { useEffect } from 'react';

declare global {
  type Process = {
    readonly env: {
      [key: string]: string
      NODE_ENV: 'production' | 'development'
    }
  }

  export const process: Process;
}

export const isDev = process.env.NODE_ENV === 'development';

export function useDev (cb: () => void) {
  if (process.env.NODE_ENV === 'development') {
    cb();
  }
}

export function useTrackMount (label: string) {
  useEffect(() => {
    console.log(label + ' mount')
    return () => {
      console.log(label + ' unmount')
    }
  }, [label]);
}
