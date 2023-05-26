import { useMemo } from 'react';
import rjs from 'roughjs';
import { useSize } from '../../../utils/size';

export default function RoughRoundedRect ({ color, spacing = 0 }: { color: string, spacing?: number }) {
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

    const vertical = size.width < size.height;
    const s = Math.min(size.width, size.height);

    if (!vertical) {
      const d = s - 2 * spacing;
      let g = pen.arc(d / 2 + spacing, d / 2 + spacing, d, d, Math.PI * 0.5, Math.PI * 1.5);
      svg.append(g);
      g = pen.arc(d / 2 + spacing + size.width - s, d / 2 + spacing, d, d, Math.PI * 1.5, Math.PI * 2.5);
      svg.append(g);
      g = pen.line(d / 2 + spacing, spacing, d / 2 + spacing + size.width - s, spacing);
      svg.append(g);
      g = pen.line(d / 2 + spacing, d + spacing, d / 2 + spacing + size.width - s, d + spacing);
      svg.append(g);
    }

    return svg.innerHTML;
  }, [size.width, size.height]);

  return (
    <svg ref={ref} className="absolute z-0 left-0 top-0 w-full h-full pointer-events-none" width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}