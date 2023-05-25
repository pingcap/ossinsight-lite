import React, {ForwardedRef, HTMLProps, useEffect, useState} from 'react';
import {unified} from "unified";
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

export interface IProps extends HTMLProps<HTMLDivElement> {
  title: string
  markdown: string
}

export default function Markdown (props: IProps, ref: ForwardedRef<HTMLDivElement>) {
  const [html, setHtml] = useState<string>()
  useEffect(() => {
    (async () => {
      const result = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeDocument, {title: props.title})
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(props.markdown)
      const str = String(result)
      setHtml(str)
    })()
  }, [props]);

  console.log({file: html})
  return (
    <div dangerouslySetInnerHTML={{__html: html}} {...props} />
  );
}
