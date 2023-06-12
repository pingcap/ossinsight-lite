import WidgetPreview from '@/components/WidgetPreview';
import LoadingIndicator from '@/packages/ui/components/loading-indicator/Icon';
import { LibraryItem } from '@/utils/types/config';
import { Suspense } from 'react';

export default function Item ({ item: { name, id, props: { showBorder, ...props } } }: { item: LibraryItem }) {
  return (
    <li className="border border-gray bg-white rounded text-gray-700 flex flex-col gap-4 p-2" key={name}>
      <div className="h-[239px] flex flex-col justify-stretch overflow-hidden">
        <Suspense fallback={<div className="w-full h-full flex justify-center items-center gap-2"><LoadingIndicator /> Loading widget...</div>}>
          <WidgetPreview
            className="font-sketch"
            id={id}
            name={name}
            props={props}
          />
        </Suspense>
      </div>
    </li>
  );
}