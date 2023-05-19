'use client';
import clientOnly from '@/src/utils/clientOnly';
import Link from 'next/link';
import React from 'react';

function List ({ dashboards }: { dashboards: string[] }) {
  return (
    <>
      {dashboards.map(dashboard => {
        if (dashboard !== 'default') {
          return <li key={dashboard}><Link href={`/dashboards/${encodeURIComponent(dashboard)}`}>{dashboard}</Link></li>;
        } else {
          return <li key={dashboard}><Link href="/">default</Link></li>;
        }
      })}
    </>
  );
}

export default clientOnly(List);
