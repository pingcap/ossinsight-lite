'use client';
import { appState } from '@/core/bind';
import { reloadAuth } from '@/core/bind-client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId } from 'react';

const currentGuards: Record<string, (() => void)[]> = {};

export function useAuthGuard<T> (cb: () => T, forceCheck: boolean = false): () => Promise<T> {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const id = useId();

  useEffect(() => {
    if (!currentGuards[id]) {
      currentGuards[id] = [];
      return () => {
        delete currentGuards[id];
      };
    }
  }, []);

  return async function () {
    if (appState.current.authenticated) {
      if (!forceCheck) {
        return cb();
      }
      const auth = await reloadAuth();
      if (auth.authenticated) {
        return cb();
      }
    }
    let loginUrl = '/login-modal';
    if (pathname) {
      let redirect = pathname;
      const paramsString = params?.toString();
      if (paramsString) {
        redirect += '?' + paramsString;
      }
      loginUrl += `?redirect_uri=${encodeURIComponent(redirect)}`;
    }

    await new Promise<void>((resolve) => {
      router.push(loginUrl);
      currentGuards[id].push(resolve);
      console.debug(id, 'request auth');
    });
    console.debug(id, 'auth pass');
    return cb();
  };
}

export function resolveCurrentGuards () {
  console.debug('resolve auth');
  Object.values(currentGuards).forEach(resolves => {
    resolves.forEach(cb => cb());
    resolves.splice(0, resolves.length);
  });
}
