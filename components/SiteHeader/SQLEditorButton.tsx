'use client';

import authApi from '@/store/features/auth';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import './style.scss';
import TerminalIcon from 'bootstrap-icons/icons/terminal.svg';

export function SQLEditorButton () {
  const router = useRouter();
  const { data: { playground: playgroundEnabled } = { playground: false } } = authApi.useReloadQuery();

  const handleClick = useCallback(() => {
    router.push('/playground');
  }, []);
  if (playgroundEnabled) {
    return (
      <button className="site-header-item site-header-item-optional" onClick={handleClick}>
        <TerminalIcon width={16} />
        <span>
          SQL Editor
        </span>
      </button>
    );
  } else {
    return null;
  }
}
