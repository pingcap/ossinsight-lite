'use client';

import WidgetDetails from '@/components/WidgetDetails/WidgetDetails';
import WidgetPreview from '@/components/WidgetPreview/WidgetPreview';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import ClipboardCheckIcon from 'bootstrap-icons/icons/clipboard-check-fill.svg';
import ClipboardIcon from 'bootstrap-icons/icons/clipboard.svg';
import TwitterIcon from 'bootstrap-icons/icons/twitter.svg';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

interface WidgetPreviewWithDetailsProps {
  item: LibraryItem;
}

function WidgetPreviewWithDetails ({ item }: WidgetPreviewWithDetailsProps) {
  const { showBorder, ...props } = item.props;

  return (
    <div className="flex mx-auto max-w-[480px] flex-col gap-2 justify-center items-stretch p-2 overflow-hidden">
      <Url title={item.props.title ?? ''} />
      <div className="w-full min-h-[320px] max-h-[320px] flex-1 flex flex-col">
        <WidgetPreview id={item.id} name={item.name} props={item.props} />
      </div>
      <div className="w-full min-h-[240px] max-h-[240px] flex-1 flex flex-col overflow-hidden">
        <WidgetDetails id={item.id} name={item.name} props={item.props} />
      </div>
    </div>
  );
}

function Url ({ title }: { title: string }) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const url = `${location.origin}${pathname}`;

  const handleCopy = useCallback(() => {
    setCopied(false);
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
      });
  }, [url]);
  return (
    <div className="max-w-[480px] w-full border bg-gray-200 rounded text-sm text-gray-700 px-2 py-1 flex items-center justify-between gap-2">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {url}
      </span>
      <span className="flex gap-2 items-center">
        <button onClick={handleCopy} className="btn btn-sm btn-link">
          {copied ? <ClipboardCheckIcon className="text-green-500" /> : <ClipboardIcon />}
        </button>
        <a className="btn btn-sm btn-link" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank">
          <TwitterIcon />
        </a>
      </span>
    </div>
  );
}

export default clientOnly(WidgetPreviewWithDetails);
