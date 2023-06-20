import { PADDING } from '@/components/pages/Dashboard/utils';
import { useSize } from '@/packages/ui/utils/size';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export interface GridGuideCanvasProps {
  editing: boolean;
  rows: number;
  cols: number;
  rowHeight: number;
}

const pixelRatio = typeof devicePixelRatio === 'undefined' ? 1 : devicePixelRatio;

export default function GridGuideCanvas ({ editing, cols, rows, rowHeight }: GridGuideCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { size: { width, height }, ref: containerRef } = useSize<HTMLDivElement>();
  const compact = rowHeight < 56;

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio);
        if (editing) {
          drawEditingGuide(ctx, width, height, cols, rows, compact);
        } else {
          drawExploreGuide(ctx, width, height, cols, rows, compact);
        }
      }
    }
  }, [editing, cols, rows, width, height]);

  return (
    <div className={clsx('grid-guide', { compact })} ref={containerRef}>
      <canvas ref={ref} className="w-full h-full" width={width * pixelRatio} height={height * pixelRatio} />
    </div>
  );
}

const rowGuideLines = 8;

const guideGridLinesColor = 'rgba(248, 242, 237, 1)';
const guideGridCirclesColor = 'rgba(236, 228, 221, 1)';
const guideCrossColor = 'rgba(227, 227, 227, 1)';

function drawExploreGuide (ctx: CanvasRenderingContext2D, width: number, height: number, cols: number, rows: number, compact: boolean) {
  const extraRows = (compact ? 2 : 1);
  const padding = PADDING * pixelRatio;
  const paddingTop = (compact ? 3 : 2) * 56 * pixelRatio;
  width *= pixelRatio;
  height *= pixelRatio;
  const contentWidth = width - padding * 2;
  const contentHeight = height - padding * 2 - paddingTop;

  const rowSize = contentHeight / (rows);
  const colSize = contentWidth / (cols);
  const colGuideLines = Math.round(8 * colSize / rowSize);

  const rowLines = (rows) * rowGuideLines;
  const colLines = (cols) * colGuideLines;
  const rowLineGap = contentHeight / rowLines;
  const colLineGap = contentWidth / colLines;
  ctx.strokeStyle = guideGridLinesColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= colLines; i++) {
    ctx.beginPath();
    if (i % colGuideLines === 0) {
      ctx.lineWidth = 3;
    } else {
      ctx.lineWidth = 1;
    }
    ctx.moveTo(colLineGap * i + padding, 0);
    ctx.lineTo(colLineGap * i + padding, height + paddingTop);
    ctx.stroke();
  }

  for (let i = -extraRows * rowGuideLines; i <= rowLines; i++) {
    ctx.beginPath();
    if (i % rowGuideLines === 0) {
      ctx.lineWidth = 3;
    } else {
      ctx.lineWidth = 1;
    }
    ctx.moveTo(0, rowLineGap * i + padding + paddingTop);
    ctx.lineTo(width, rowLineGap * i + padding + paddingTop);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.strokeStyle = 'none';
  ctx.fillStyle = guideGridCirclesColor;
  for (let i = -extraRows; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      ctx.moveTo(padding + colSize * j, padding + rowSize * i + paddingTop);
      ctx.ellipse(padding + colSize * j, padding + rowSize * i + paddingTop, 4, 4, 0, 0, Math.PI * 2);
    }
  }
  ctx.fill();
}

function drawEditingGuide (ctx: CanvasRenderingContext2D, width: number, height: number, cols: number, rows: number, compact: boolean) {
  const padding = PADDING * pixelRatio;
  const paddingTop = (compact ? 3 : 2) * 56 * pixelRatio;
  width *= pixelRatio;
  height *= pixelRatio;
  const contentWidth = width - padding * 2;
  const contentHeight = height - padding * 2 - paddingTop;

  const rowSize = contentHeight / (rows);
  const colSize = contentWidth / (cols);

  const size = 12;
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = guideCrossColor;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      const x = padding + colSize * j;
      const y = padding + paddingTop + rowSize * i;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - size);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + size);
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y);
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
    }
  }
  ctx.stroke();
}