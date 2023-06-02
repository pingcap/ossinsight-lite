import clsx from 'clsx';
import { SVGAttributes } from 'react';

export interface OpenIndicatorProps {
  open: boolean;
}

export default function OpenIndicator ({ open, className, ...props }: OpenIndicatorProps & SVGAttributes<SVGSVGElement>) {
  return (
    <svg className={clsx('transition-transform', open ? 'rotate-180' : '', className)} width="16" height="16" fill="currentColor" {...props} viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
    </svg>
  );
}
