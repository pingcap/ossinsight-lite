import { useSize } from '../../utils/size';
import { ReactElement, useMemo } from 'react';
import rjs from 'roughjs';
import * as colors from 'tailwindcss/colors';

export default function RoughBox ({ color }: { color: string }) {
  const { size, ref } = useSize<SVGSVGElement>({
    parent: true,
  });

  const svg = useMemo(() => {
    const svg = document.createElement('svg') as any as SVGSVGElement;
    svg.setAttribute('viewbox', `0 0 ${size.width} ${size.height}`);
    svg.setAttribute('width', size.width + 'px');
    svg.setAttribute('height', size.height + 'px');

    const pen = rjs.svg(svg, {
      options: {
        stroke: color,
        fill: color + '80',
      },
    });
    const g = pen.rectangle(0, 0, size.width, size.height);
    svg.append(g);

    return svg.innerHTML;
  }, [size.width, size.height]);

  return (
    <svg ref={ref} className="absolute z-0 left-0 top-0 w-full h-full pointer-events-none" width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}