import React, { ForwardedRef, HTMLProps } from 'react';
import cu from '../curr_user.sql?unique';
import clsx from 'clsx';

export default function Widget (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div {...props} className={clsx('overflow-hidden flex flex-col p-2 gap-2 items-center justify-center', props.className)} ref={ref}>
      <img
        className="block rounded-xl w-12 h-12"
        alt={cu.login} src={`https://github.com/${cu.login}.png`}
      />
      <div className="flex flex-col">
        <span className="text-gray-700">@{cu.login}</span>
        <span className="text-gray-500">{cu.bio}</span>
      </div>
    </div>
  );
}
