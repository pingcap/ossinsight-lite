import { ForwardedRef, HTMLProps } from 'react';
import Link from 'next/link';

export function Navigator (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <nav {...props} ref={ref}>
      <ul className='h-full px-2'>
        <li className='h-full flex'>
          <Link className='flex justify-center items-center' href="/browse">
            <span>
              Widgets list
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}