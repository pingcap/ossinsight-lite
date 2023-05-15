import { useSize } from '../../../utils/size';
import { useMemo } from 'react';
import rjs from 'roughjs';

export default function RoughCircle ({ color, spacing = 0 }: { color: string, spacing?: number }) {
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

    const s = Math.min(size.width, size.height);

    const g = pen.circle(size.width / 2, size.height / 2, s - 2 * spacing);
    svg.append(g);

    return svg.innerHTML;
  }, [size.width, size.height, color]);

  return (
    <svg ref={ref} className="absolute z-0 left-0 top-0 w-full h-full pointer-events-none" width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}