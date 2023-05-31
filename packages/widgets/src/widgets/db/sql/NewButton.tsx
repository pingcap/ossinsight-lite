'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes, RefAttributes } from 'react';
import CodeSlashIcon from './code-slash.svg';
import TiDBCloudIcon from './tidbcloud.svg';

export default function NewButton ({ forwardedRef, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { forwardedRef: RefAttributes<HTMLButtonElement>['ref'] }) {
  return (
    <button ref={forwardedRef} {...props} className={clsx('bg-gray-300 hover:bg-gray-400 transition-colors rounded px-2 py-1 flex gap-2 items-center', props.className)}>
      <TiDBCloudIcon width={14} height={14} />
      <span className="text-gray-700 text-sm font-mono">
        <CodeSlashIcon width={14} height={14} />
      </span>
    </button>
  );
}
