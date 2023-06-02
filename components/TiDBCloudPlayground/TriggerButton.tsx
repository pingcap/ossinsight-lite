'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import './style.scss';
import Logo from './tidbcloud.svg';

export function TiDBCloudPlaygroundButton () {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push('/playground');
  }, []);

  return (
    <button className="btn btn-playground" onClick={handleClick}>
      <Logo width={16} />
      <span>
        &gt;_ SQL
      </span>
    </button>
  );
}
