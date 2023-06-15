'use client';

import clsx from 'clsx';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes } from 'react';
import cu from '../curr_user.sql?unique';

function Widget ({ forwardedRef, ...props }: HTMLProps<HTMLDivElement> & { forwardedRef: RefAttributes<HTMLDivElement>['ref'] }, _ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div {...props} className={clsx('overflow-hidden flex p-2 gap-2 items-center justify-center', props.className)} ref={forwardedRef}>
      <span className="text-gray-700">{cu.login}</span>
    </div>
  );
}

export default forwardRef(Widget);
