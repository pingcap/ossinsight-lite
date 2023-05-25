import WidgetContext from '@ossinsight-lite/ui/context/widget';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { ForwardedRef, useContext } from 'react';
import { MarkdownEditor } from '../../components/editor/markdown/MarkdownEditor';
import { IProps } from './Markdown';

export default function ({ markdown, ...props }: IProps, ref: ForwardedRef<HTMLDivElement>) {
  const { onPropChange } = useContext(WidgetContext)

  const handleChange = useRefCallback((markdown: string) => {
    onPropChange('markdown', markdown);
  });

  return (
    <div ref={ref} {...props}>
      <MarkdownEditor markdown={markdown} onMarkdownChange={handleChange} />
    </div>
  );
}
