'use client';
import { appState } from '@/app/bind';
import { useEffect } from 'react';

export default function AppLoading () {
  useEffect(() => {
    appState.update({
      ...appState.current,
      loading: appState.current.loading + 1,
    });

    return () => {
      appState.update({
        ...appState.current,
        loading: appState.current.loading - 1,
      });
    };
  }, []);
  return null;
}