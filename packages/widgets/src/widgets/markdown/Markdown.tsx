'use client';

import clsx from 'clsx';
import {createElement, ForwardedRef, forwardRef, Fragment, HTMLProps, RefAttributes, useEffect, useState} from 'react';
import remarkParse from 'remark-parse'
import remarkRehype from "remark-rehype";
import rehypeReact from 'rehype-react'
import { unified } from 'unified';

import './github-markdown.css';

export interface IProps extends HTMLProps<HTMLDivElement> {
  // See https://github.com/vercel/next.js/issues/40769
  forwardedRef?: RefAttributes<HTMLDivElement>['ref'];

  markdown: string;
}

function Markdown (props: IProps, _ref: ForwardedRef<HTMLDivElement>) {
  const { markdown, className, forwardedRef, ...rest } = props;
  const jsx = useMarkdown(markdown);
  return (
    <div ref={forwardedRef} className={clsx(className, 'markdown-body p-2 overflow-y-auto overflow-x-hidden')} {...rest}>
      {jsx}
    </div>
  );
}

function useMarkdown (markdown) {
  const [Content, setContent] = useState(<></>)

  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeReact, {createElement, Fragment})
      .process(markdown)
      .then((file) => {
        setContent(file.result)
      })
  }, [markdown])

  return Content
}

export default forwardRef(Markdown);
