'use client';
import authApi from '@/store/features/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId } from 'react';

const currentGuards: Record<string, (() => void)[]> = {};

export function useAuthGuard<T> (cb: () => T, allowBypass: boolean, forceCheck: boolean = false): () => Promise<T> {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const id = useId();

  const authState = authApi.useReloadQuery();

  useEffect(() => {
    if (!currentGuards[id]) {
      currentGuards[id] = [];
      return () => {
        delete currentGuards[id];
      };
    }
  }, []);

  return async function () {
    if (allowBypass) {
      return cb();
    }
    if (authState.data?.authenticated) {
      if (!forceCheck) {
        return cb();
      }
      const auth = await authState.refetch();
      if (auth.data?.authenticated) {
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
      loginUrl += `?redirect_uri=${encodeURIComponent(redirect ?? '/')}`;
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
