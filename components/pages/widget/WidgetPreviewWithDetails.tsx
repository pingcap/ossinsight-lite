'use client';

import CopyIcon from '@/components/icons/copy.svg';
import WidgetDetails from '@/components/WidgetDetails/WidgetDetails';
import WidgetPreview from '@/components/WidgetPreview/WidgetPreview';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

interface WidgetPreviewWithDetailsProps {
  item: LibraryItem;
}

function WidgetPreviewWithDetails ({ item }: WidgetPreviewWithDetailsProps) {
  return (
    <div className="flex mx-auto max-w-[480px] flex-col gap-2 justify-center items-stretch p-2 overflow-hidden">
      <Url />
      <div className="w-full min-h-[320px] max-h-[320px] flex-1 flex flex-col">
        <WidgetPreview id={item.id} name={item.name} props={item.props} />
      </div>
      <div className="w-full min-h-[240px] max-h-[240px] flex-1 flex flex-col overflow-hidden">
        <WidgetDetails id={item.id} name={item.name} props={item.props} />
      </div>
    </div>
  );
}

function Url () {
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
      <button onClick={handleCopy} className="flex gap-1 text-sm text-gray-400 items-center">
        {copied && 'Copied!'}
        <CopyIcon />
      </button>
    </div>
  );
}

export default clientOnly(WidgetPreviewWithDetails);
