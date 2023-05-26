import { ForwardedRef, forwardRef, HTMLProps, RefAttributes, useEffect, useState } from 'react';
import clsx from "clsx";
import {unified} from "unified";
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

import './github-markdown.css'

export interface IProps extends HTMLProps<HTMLDivElement> {
  // See https://github.com/vercel/next.js/issues/40769
  forwardedRef?: RefAttributes<HTMLDivElement>['ref']

  markdown: string
}

function Markdown (props: IProps, _ref: ForwardedRef<HTMLDivElement>) {
  const {markdown, className, forwardedRef, ...rest} = props
  const html = useMarkdown(markdown)
  return (
    <div ref={forwardedRef} className={clsx(className, 'markdown-body p-2')} dangerouslySetInnerHTML={{__html: html}} {...rest} />
  );
}

function useMarkdown(markdown) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const file = unified()
      .use(remarkParse)
      .use(remarkRehype, {allowDangerousHtml: true})
      .use(rehypeRaw)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(markdown)
      .then((value) => {
        setHtml(String(value))
      })
  }, [markdown])

  return html
}

export default forwardRef(Markdown)
