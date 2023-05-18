import {useCallback} from 'react'

const g = typeof window !== 'undefined'
  ? window
  : typeof globalThis !== 'undefined'
    ? globalThis
    : global;

export const prerenderMode = g.__OSSW_MODE__ === 'prerender';

let usePrerenderCallbackCalled = false

export const usePrerenderCallback = () => {
  if (!usePrerenderCallbackCalled) {
    g.__OSSW_PRERENDER_DONE__ = false;
    usePrerenderCallbackCalled = true;
  }

  return useCallback(() => {
    g.__OSSW_PRERENDER_DONE__ = true;
  }, [])
}
export const prerenderCallback =
  prerenderMode
    ? () => {
      g.__OSSW_PRERENDER_DONE__ = true;
    }
    : () => {
    }