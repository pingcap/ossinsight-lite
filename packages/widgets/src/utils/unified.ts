import { createElement, Fragment, ReactElement, use, useMemo } from 'react';
import rehypeReact from 'rehype-react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeReact, { createElement, Fragment })
  .freeze();

export function useMarkdownReact (text: string): ReactElement {
  const promise = useMemo(() => {
    return processor.process(text)
      .then((file) => {
        return file.result;
      });
  }, [text]);
  return use(promise);
}
