import { MARGIN, PADDING, ROWS } from '@/components/pages/Dashboard/utils';
import { BreakpointName, cols } from '@/utils/layout';
import { Layout } from 'react-grid-layout';

interface GridGuideProps {
  rowHeight: number;
  breakpoint: BreakpointName;
  layout: Layout[] | undefined;
}

export default function GridGuide ({ rowHeight, breakpoint, layout }: GridGuideProps) {
  const rowsCount = ROWS;
  const colsCount = cols[breakpoint];

  return (
    <div
      className='grid-guide'
      style={{
        padding: PADDING,
        // @ts-ignore
        '--grid-guide-gap': MARGIN + 'px',
        '--grid-guide-row-height': rowHeight + 'px',
      }}
    >
      <svg id="grid-guide-point" xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="guide-point" width={8} height={8} viewBox="0 0 8 8" stroke="#ccc">
          <path d="M0,4 H8 M4,0 V8" />
        </symbol>
      </svg>
      <div className={`flex flex-col gap-[var(--grid-guide-gap)]`}>
        {array(rowsCount).map((_, i) => (
          <div key={i} className={`flex items-stretch gap-[var(--grid-guide-gap)] h-[var(--grid-guide-row-height)]`}>
            {array(colsCount).map((_, i) => (
              <div key={i} className="flex-1 flex items-center justify-center">
                <svg width={8} height={8}>
                  <use href="#guide-point" />
                </svg>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function array (n: number) {
  return Array(n).fill(undefined, 0, n);
}

