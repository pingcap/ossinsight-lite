import React, {createElement, ForwardedRef, Fragment, HTMLProps, useEffect, useState} from 'react';
import {unified} from "unified";
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'

export interface IProps extends HTMLProps<HTMLDivElement> {
  markdown: string
}

export default function Markdown (props: IProps, ref: ForwardedRef<IProps>) {
  const html = useProcessor(props.markdown)
  return (
    <div dangerouslySetInnerHTML={{__html: html}} {...props} />
  );
}

function useProcessor(text) {
  const [Content, setContent] = useState(<></>)

  useEffect(() => {
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeReact, {createElement, Fragment})
      .process(text)
      .then((file) => {
        setContent(file.result)
      })
  }, [text])

  return Content
}
