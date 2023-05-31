'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes, RefAttributes } from 'react';
import MdIcon from '../md.svg';
import LinkIcon from './link.svg';

export default function NewButton ({ forwardedRef, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { forwardedRef: RefAttributes<HTMLButtonElement>['ref'] }) {
  return (
    <button ref={forwardedRef} {...props} className={clsx('bg-gray-300 hover:bg-gray-400 transition-colors rounded px-2 py-1 flex items-center text-gray-700 gap-1', props.className)}>
      <MdIcon width={14} height={14} />
      <LinkIcon width={14} height={14} className='text-blue-600' />
    </button>
  );
}
