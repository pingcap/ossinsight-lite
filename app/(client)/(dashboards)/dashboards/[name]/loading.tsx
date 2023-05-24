'use client';

import { appState } from '@/app/bind';
import { useEffect } from 'react';

export default function Loading () {
  useEffect(() => {
    const lastRouting = appState.current.routing;
    appState.update({
      ...appState.current,
      routing: true,
    });

    return () => {
      appState.update({
        ...appState.current,
        routing: lastRouting,
      });
    };
  }, []);
  return null;
}