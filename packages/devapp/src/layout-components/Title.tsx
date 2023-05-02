import { HTMLProps } from 'react';
import clsx from 'clsx';

export function Title (props: HTMLProps<HTMLHeadingElement>) {
  return (
    <h1 {...props} className={clsx(props.className, 'text-xl text-gray-700 flex justify-center items-center')}>
      <span>
        My dashboard
      </span>
    </h1>
  );
}