import { HTMLProps } from 'react';
import { Link } from 'react-router-dom';

export function Navigator (props: HTMLProps<HTMLDivElement>) {
  return (
    <nav {...props}>
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