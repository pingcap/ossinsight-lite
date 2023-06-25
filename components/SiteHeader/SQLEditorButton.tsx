'use client';

import authApi from '@/store/features/auth';
import clientOnly from '@/utils/clientOnly';
import TiDBCloudIcon from '@ossinsight-lite/widgets/src/widgets/db/sql/tidbcloud.svg';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import './style.scss';

export function _SQLEditorButton () {
  const router = useRouter();
  const { data: { playground: playgroundEnabled } = { playground: false } } = authApi.useReloadQuery();

  const handleClick = useCallback(() => {
    router.push('/query-my-database');
  }, []);
  if (playgroundEnabled) {
    return (
      <button className="site-header-item site-header-item-optional" onClick={handleClick}>
        <TiDBCloudIcon width={16} />
        <span className='underline'>
          Query my database!
        </span>
      </button>
    );
  } else {
    return null;
  }
}

export const SQLEditorButton = clientOnly(_SQLEditorButton)
