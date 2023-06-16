'use client';

import clsx from 'clsx';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes } from 'react';
import cu from '../curr_user.sql?unique';

function Widget ({ forwardedRef, ...props }: HTMLProps<HTMLDivElement> & { forwardedRef: RefAttributes<HTMLDivElement>['ref'] }, _ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div {...props} className={clsx('overflow-hidden flex p-2 gap-2 items-center justify-center', props.className)} ref={forwardedRef}>
      <img
        className="block rounded-full aspect-square"
        alt={cu.login} src={`https://github.com/${cu.login}.png`}
      />
    </div>
  );
}

export default forwardRef(Widget);
