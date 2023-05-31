'use client';

import WidgetContext from '@ossinsight-lite/ui/context/widget';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { ForwardedRef, forwardRef, useContext } from 'react';
import { MarkdownEditor } from '../../components/editor/markdown/MarkdownEditor';
import { IProps } from './Markdown';

function Editor ({ markdown, forwardedRef, ...props }: IProps, _ref: ForwardedRef<HTMLDivElement>) {
  const { onPropChange } = useContext(WidgetContext);

  const handleChange = useRefCallback((markdown: string) => {
    onPropChange('markdown', markdown);
  });

  return (
    <div ref={forwardedRef} {...props}>
      <MarkdownEditor markdown={markdown} onMarkdownChange={handleChange} />
    </div>
  );
}

export default forwardRef(Editor);
