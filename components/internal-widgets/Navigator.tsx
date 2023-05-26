import Link from 'next/link';
import { ForwardedRef, HTMLProps } from 'react';

export function Navigator (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <nav {...props} ref={ref}>
      <ul className="h-full px-2">
        <li className="h-full flex">
          <Link className="flex justify-center items-center" href="/">
            <span>
              Widgets list
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}