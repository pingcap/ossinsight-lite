import clsx from 'clsx';
import { ForwardedRef, HTMLProps } from 'react';

export function Title (props: HTMLProps<HTMLHeadingElement>, ref: ForwardedRef<HTMLHeadingElement>) {
  return (
    <h1 {...props} ref={ref} className={clsx(props.className, 'text-xl text-gray-700 flex justify-center items-center')}>
      <span>
        My dashboard
      </span>
    </h1>
  );
}