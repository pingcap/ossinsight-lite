import { ForwardedRef, forwardRef, HTMLProps, RefAttributes } from 'react';
import cu from '../curr_user.sql?unique';
import clsx from 'clsx';

function Widget ({ forwardedRef, ...props }: HTMLProps<HTMLDivElement> & { forwardedRef: RefAttributes<HTMLDivElement>['ref'] }, _ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div {...props} className={clsx('overflow-hidden flex flex-col p-2 gap-2 items-center justify-center', props.className)} ref={forwardedRef}>
      <img
        className="block rounded-xl w-12 h-12"
        alt={cu.login} src={`https://github.com/${cu.login}.png`}
      />
      <div className="flex flex-col">
        <span className="text-gray-700">{cu.login}</span>
        <span className="text-gray-500">{cu.bio}</span>
      </div>
    </div>
  );
}

export default forwardRef(Widget)
