import { ForwardedRef, HTMLProps } from 'react';
import { Link } from 'react-router-dom';

export function Navigator (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <nav {...props} ref={ref}>
      <ul className='h-full px-2'>
        <li className='h-full flex'>
          <Link className='flex justify-center items-center' to="/browse">
            <span>
              Widgets list
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}