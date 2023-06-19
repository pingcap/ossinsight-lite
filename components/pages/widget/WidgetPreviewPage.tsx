'use client';

import GridGuideCanvas from '@/components/pages/Dashboard/GridGuideCanvas';
import { useRowHeight } from '@/components/pages/Dashboard/hooks';
import WidgetPreview from '@/components/WidgetPreview/WidgetPreview';
import { useBreakpoint } from '@/utils/breakpoint';
import { breakpoints, cols } from '@/utils/layout';
import { LibraryItem } from '@/utils/types/config';
import Arrow90DegLeftIcon from 'bootstrap-icons/icons/arrow-90deg-left.svg';
import Link from 'next/link';
import './page-style.scss';

export default function WidgetPreviewPage ({ item }: { item: LibraryItem }) {
  const breakpoint = useBreakpoint(breakpoints, 'lg');
  const rowHeight = useRowHeight();

  return (
    <div className="widget-preview-page">
      <GridGuideCanvas editing={false} rows={13} cols={cols[breakpoint]} rowHeight={rowHeight} />
      <WidgetPreview wrapperClassName="widget" id={item.id} name={item.name} props={item.props} noTitle />
      <div className="buttons">
        <Link className="btn btn-link" href="/" prefetch={false}>
          <Arrow90DegLeftIcon />
          Back to home
        </Link>
        <a className="btn btn-primary" href="https://github.com/pingcap/ossinsight-lite#how-to-deploy-your-own-10mins" target="_blank">
          ✨ Create my own chart
        </a>
      </div>
    </div>
  );
}
