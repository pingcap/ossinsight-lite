import { PADDING } from '@/components/pages/Dashboard/utils';
import { useSize } from '@/packages/ui/utils/size';
import { BreakpointName, cols as breakpointCols } from '@/utils/layout';
import { useEffect, useRef } from 'react';

export interface GridGuideCanvasProps {
  editing: boolean;
  rows: number;
  breakpoint: BreakpointName;
}

const pixelRatio = typeof devicePixelRatio === 'undefined' ? 1 : devicePixelRatio;

export default function GridGuideCanvas ({ editing, breakpoint, rows }: GridGuideCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { size: { width, height }, ref: containerRef } = useSize<HTMLDivElement>();

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio);
        if (editing) {
          drawEditingGuide(ctx, width, height, breakpointCols[breakpoint], rows);
        } else {
          drawExploreGuide(ctx, width, height, breakpointCols[breakpoint], rows);
        }
      }
    }
  }, [editing, breakpoint, rows, width, height]);

  return (
    <div className="grid-guide" ref={containerRef}>
      <canvas ref={ref} className="w-full h-full" width={width * pixelRatio} height={height * pixelRatio} />
    </div>
  );
}

const rowGuideLines = 8;

const guideGridLinesColor = 'rgba(248, 242, 237, 1)';
const guideGridCirclesColor = 'rgba(236, 228, 221, 1)';
const guideCrossColor = 'rgba(227, 227, 227, 1)';

function drawExploreGuide (ctx: CanvasRenderingContext2D, width: number, height: number, cols: number, rows: number) {
  const padding = PADDING * pixelRatio;
  width *= pixelRatio;
  height *= pixelRatio;
  const contentWidth = width - padding * 2;
  const contentHeight = height - padding * 2;

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
    ctx.lineTo(colLineGap * i + padding, height);
    ctx.stroke();
  }

  for (let i = 0; i <= rowLines; i++) {
    ctx.beginPath();
    if (i % rowGuideLines === 0) {
      ctx.lineWidth = 3;
    } else {
      ctx.lineWidth = 1;
    }
    ctx.moveTo(0, rowLineGap * i + padding);
    ctx.lineTo(width, rowLineGap * i + padding);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.strokeStyle = 'none';
  ctx.fillStyle = guideGridCirclesColor;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      ctx.moveTo(padding + colSize * j, padding + rowSize * i);
      ctx.ellipse(padding + colSize * j, padding + rowSize * i, 4, 4, 0, 0, Math.PI * 2);
    }
  }
  ctx.fill();
}

function drawEditingGuide (ctx: CanvasRenderingContext2D, width: number, height: number, cols: number, rows: number) {
  const padding = PADDING * pixelRatio;
  width *= pixelRatio;
  height *= pixelRatio;
  const contentWidth = width - padding * 2;
  const contentHeight = height - padding * 2;

  const rowSize = contentHeight / (rows);
  const colSize = contentWidth / (cols);

  const size = 12;
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = guideCrossColor;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      const x = padding + colSize * j;
      const y = padding + rowSize * i;
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