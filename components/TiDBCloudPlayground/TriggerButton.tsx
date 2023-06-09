'use client';

import authApi from '@/store/features/auth';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import './style.scss';
import Logo from './tidbcloud.svg';

export function TiDBCloudPlaygroundButton () {
  const router = useRouter();
  const { data: { playground: playgroundEnabled } = { playground: false } } = authApi.useReloadQuery();

  const handleClick = useCallback(() => {
    router.push('/playground');
  }, []);
  if (playgroundEnabled) {
    return (
      <button className="btn btn-sm btn-playground" onClick={handleClick}>
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
