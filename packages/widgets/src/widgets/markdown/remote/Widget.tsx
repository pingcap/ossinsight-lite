'use client';

import clsx from 'clsx';
import { forwardRef, HTMLAttributes, RefAttributes } from 'react';
import { useGetText } from '../../../utils/fetch';
import { useMarkdownReact } from '../../../utils/unified';

export interface WidgetProps extends HTMLAttributes<HTMLDivElement> {
  href?: string;
  forwardedRef?: RefAttributes<HTMLDivElement>['ref'];
}

const Widget = forwardRef<HTMLDivElement, WidgetProps>(function Widget ({ href, forwardedRef, className, ...props }, ref) {
  const markdown = useGetText(href);
  const nodes = useMarkdownReact(markdown, href);

  return (
    <div ref={forwardedRef} className={clsx(className, 'markdown-body overflow-y-auto overflow-x-hidden p-2')} {...props}>
      {nodes}
    </div>
  );
});

export default Widget;
