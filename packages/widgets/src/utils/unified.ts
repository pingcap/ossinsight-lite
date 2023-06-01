import { createElement, Fragment, ReactElement, useEffect, useState } from 'react';
import rehypeReact from 'rehype-react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const processor = unified()
  .use(remarkParse)
  .use(() => {
    return (node, file) => {
      const base: string = file.data.base as string;
      let mdBase = base;
      if (!base) {
        return;
      }
      if (base.startsWith('https://raw.githubusercontent.com/')) {
        mdBase = getGithubMdBase(base);
      }
      visit(node, n => n.type === 'link' || n.type === 'image', (node: any) => {
        if (node.url) {
          if (!/^https?:\/\//.test(node.url)) {
            if (/\.md$/.test(node.url)) {
              if (base.startsWith('https://raw.githubusercontent.com/')) {
                node.url = (new URL(node.url, mdBase)).toString();
                return;
              }
            }
            node.url = (new URL(node.url, base)).toString();
          }
        }
      });
    };
  })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeReact, {
    createElement,
    Fragment,
    components: {
      a (props) {
        return createElement('a', { ...props, target: '_blank' });
      },
    },
  })
  .freeze();

export function useMarkdownReact (text: string, base: string): ReactElement {
  const [res, setRes] = useState<ReactElement>(null);

  useEffect(() => {
    processor.process({ value: text, data: { base } })
      .then((file) => {
        setRes(file.result);
      });
  }, [text]);

  return res;
}

// https://raw.githubusercontent.com/pingcap/ossinsight-lite/main/docs/setup/secure-your-site.md
const regexp = /^https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/(.*)$/;

function getGithubMdBase (base: string) {
  const [, owner, repo, rest] = regexp.exec(base);
  return `https://github.com/${owner}/${repo}/blob\/${rest}`;
}
