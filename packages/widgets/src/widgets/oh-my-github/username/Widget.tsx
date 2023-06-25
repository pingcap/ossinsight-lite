'use client';

import AppContext from '@ossinsight-lite/ui/context/app';
import clsx from 'clsx';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes, useContext } from 'react';

function Widget ({ forwardedRef, ...props }: HTMLProps<HTMLDivElement> & { forwardedRef: RefAttributes<HTMLDivElement>['ref'] }, _ref: ForwardedRef<HTMLDivElement>) {
  const { currentUser } = useContext(AppContext);

  return (
    <div {...props} className={clsx('overflow-hidden flex p-2 gap-2 items-center justify-center', props.className)} ref={forwardedRef}>
      <span className="text-gray-700">{currentUser.login}</span>
    </div>
  );
}

export default forwardRef(Widget);
