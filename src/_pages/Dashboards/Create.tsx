'use client';
import RoughBox from '@/packages/ui/components/roughness/shape/box';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import clientOnly from '@/src/utils/clientOnly';

function Create () {
  const router = useRouter();
  const [text, setText] = useState('');
  const onCreate = useRefCallback(() => {
    router.push(`/dashboards/${encodeURIComponent(text)}`);
  });

  return (
    <>
      <input
        placeholder="Input to create new..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="inline-block relative mx-2 overflow-visible" onClick={onCreate}>
        <span className="z-10 px-2">
          Create new dashboard
        </span>
        <RoughBox color="#93a376" />
      </button>
    </>
  );
}

export default clientOnly(Create)
