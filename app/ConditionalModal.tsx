'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import { ReactNode } from 'react';

const GROUP = /^\(.*\)$/;

export default function ConditionalModal ({ children: childrenEl }: { children: ReactNode }) {
  const children = useSelectedLayoutSegments();
  const modal = useSelectedLayoutSegments('modal');

  if (children.length !== modal.length) {
    return <>{childrenEl}</>;
  }

  for (let i = 0; i < children.length; i++) {
    if (GROUP.test(modal[i]) && GROUP.test(children[i])) {
      continue;
    }
    if (modal[i] !== children[i]) {
      return <>{childrenEl}</>;
    }
  }
  return null;
}