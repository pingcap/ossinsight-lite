'use client';

import { appState } from '@/core/bind';
import { useWatchReactiveValueField } from '@/packages/ui/hooks/bind/hooks';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import './style.scss';
import Logo from './tidbcloud.svg';

export function TiDBCloudPlaygroundButton () {
  const router = useRouter();
  const playgroundEnabled = useWatchReactiveValueField(appState, 'playground');

  const handleClick = useCallback(() => {
    router.push('/playground');
  }, []);
  if (playgroundEnabled) {
    return (
      <button className="btn btn-playground" onClick={handleClick}>
        <Logo width={16} />
        <span>
        &gt;_ SQL
      </span>
      </button>
    );
  } else {
    return null;
  }
}
