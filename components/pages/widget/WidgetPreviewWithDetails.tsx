'use client';

import WidgetDetails from '@/components/WidgetDetails/WidgetDetails';
import WidgetPreview from '@/components/WidgetPreview/WidgetPreview';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import * as RuiTabs from '@radix-ui/react-tabs';
import ClipboardCheckIcon from 'bootstrap-icons/icons/clipboard-check-fill.svg';
import ClipboardIcon from 'bootstrap-icons/icons/clipboard.svg';
import CodeSlashIcon from 'bootstrap-icons/icons/code-slash.svg';
import ImageIcon from 'bootstrap-icons/icons/image.svg';
import LinkIcon from 'bootstrap-icons/icons/link.svg';
import MarkdownIcon from 'bootstrap-icons/icons/markdown.svg';
import TwitterIcon from 'bootstrap-icons/icons/twitter.svg';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { Highlight, themes } from 'prism-react-renderer';
import { useCallback, useState } from 'react';
import './style.scss';

interface WidgetPreviewWithDetailsProps {
  item: LibraryItem;
}

function WidgetPreviewWithDetails ({ item }: WidgetPreviewWithDetailsProps) {
  const { showBorder, ...props } = item.props;
  const pathname = usePathname();
  const url = `${location.origin}${pathname}`;
  const title = item.props.title ?? 'OSSInsight Lite unnamed widget';

  return (
    <div className="mx-auto max-w-[480px] p-2">
      <div className="w-full min-h-[320px] max-h-[320px] flex">
        <WidgetPreview id={item.id} name={item.name} props={item.props} noTitle />
      </div>
      <h2 className="text-xl text-center font-bold text-primary">Share this widget</h2>
      <SocialButtons title={title} url={url} />
      <hr className="my-4" />
      <div className="w-full min-h-[240px] max-h-[240px]">
        <WidgetDetails id={item.id} name={item.name} props={item.props} />
        <RuiTabs.Root defaultValue="markdown">
          <RuiTabs.List className="share-tabs-list">
            <RuiTabs.Trigger className="share-tabs-list-item" value="markdown">
              <MarkdownIcon />
              Markdown
            </RuiTabs.Trigger>
            <RuiTabs.Trigger className="share-tabs-list-item" value="html">
              <CodeSlashIcon />
              HTML
            </RuiTabs.Trigger>
            <RuiTabs.Trigger className="share-tabs-list-item" value="url">
              <LinkIcon />
              Link
            </RuiTabs.Trigger>
            <RuiTabs.Trigger className="share-tabs-list-item" value="img-url">
              <ImageIcon />
              Thumbnail Link
            </RuiTabs.Trigger>
          </RuiTabs.List>
          <RuiTabs.Content value="markdown" className="relative">
            <Code code={createMarkdownCode(title, url)} language={'markdown'} />
          </RuiTabs.Content>
          <RuiTabs.Content value="html" className="relative">
            <Code code={createHtmlCode(title, url)} language={'html'} />
          </RuiTabs.Content>
          <RuiTabs.Content value="url" className="relative">
            <Url url={url} />
          </RuiTabs.Content>
          <RuiTabs.Content value="img-url" className="relative">
            <Url url={`${url}/thumbnail.png`} />
          </RuiTabs.Content>
        </RuiTabs.Root>
        <div className="mt-2 text-xs text-secondary">
          Use it wherever you want！e.g. GitHub README.md, personal websites.
        </div>
      </div>
    </div>
  );
}

function Url ({ url }: { url: string }) {
  return (
    <div className="max-w-[480px] w-full border rounded text-sm text-gray-700 px-2 py-1 flex items-center justify-between gap-2">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {url}
      </span>
      <span className="flex gap-2 items-center rounded bg-gray-100 border">
        <CopyButton value={url} />
      </span>
    </div>
  );
}

function SocialButtons ({ title, url }: { title: string, url: string }) {
  return (
    <div className="social-section">
      <a className="social-circle twitter" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank">
        <TwitterIcon width={24} height={24} />
      </a>
    </div>
  );
}

function createMarkdownCode (title: string, url: string): string {
  return `
## ${title}

[![${title}](${url}/thumbnail.png)](${url})
`;
}

function createHtmlCode (title: string, url: string): string {
  return `
<a href="${url}" target="_blank">
  <img src="${url}/thumbnail.png" alt=${JSON.stringify(title)}>
</a>
`;
}

function Code ({ code, language }: { code: string, language: string }) {
  return (
    <Highlight
      theme={themes.github}
      code={code}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={clsx('p-2 text-xs rounded overflow-auto', className)} style={style}>
          <span className="block absolute right-2 top-2 bg-white rounded border opacity-60 hover:opacity-100 transition-opacity">
            <CopyButton value={code} />
          </span>
          <pre style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  );
}

function CopyButton ({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(false);
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
      });
  }, [value]);

  return (
    <button onClick={handleCopy} className="btn btn-sm btn-link">
      {copied ? <ClipboardCheckIcon className="text-green-500" /> : <ClipboardIcon />}
    </button>
  );
}

export default clientOnly(WidgetPreviewWithDetails);
