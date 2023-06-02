import { ReactElement, useMemo } from 'react';
import rjs from 'roughjs';
import * as colors from 'tailwindcss/colors';
import { useSize } from '../../utils/size';

export interface AlertProps {
  icon?: ReactElement;
  title?: string;
  children: unknown;
}

export function Alert ({ icon, title, children }: AlertProps) {
  const { size, ref } = useSize<HTMLDivElement>();

  const svg = useMemo(() => {
    if (!document) {
      return '';
    }
    const svg = document.createElement('svg') as any as SVGSVGElement;

    svg.setAttribute('viewbox', `0 0 ${size.width} ${size.height}`);
    svg.setAttribute('width', size.width + 'px');
    svg.setAttribute('height', size.height + 'px');

    const pen = rjs.svg(svg, {
      options: {
        stroke: colors.red['400'],
        fill: colors.red['200'],
      },
    });
    const g = pen.rectangle(0, 0, size.width, size.height);
    svg.append(g);

    return svg.innerHTML;
  }, [size.width, size.height]);

  return (
    <div className="p-8 rounded relative" ref={ref}>
      <svg className="absolute z-0 left-[8px] top-[8px] w-[calc(100%-16px)] h-[calc(100%-16px)]" width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="flex items-center gap-2 mb-4 relative z-10">
        {icon}
        {title && <h6 className="text-xl font-bold">{title}</h6>}
      </div>
      <span className="relative z-10">
        {String((children as any)?.message ?? children)}
      </span>
    </div>
  );
}
