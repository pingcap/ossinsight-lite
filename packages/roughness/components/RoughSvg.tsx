import { cloneElement, ReactElement, useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

export default function RoughSvg ({ children }: { children: ReactElement }) {

  const sourceRef = useRef<SVGSVGElement>(null);
  const targetRef = useRef<SVGSVGElement>(null);
  const [, setTransformed] = useState(false);

  const source = cloneElement(children, {
    ref: sourceRef,
    style: {
      display: 'none',
    },
  });

  const target = <svg ref={targetRef} {...source.props} className={source.props.className} style={{ ...source.props.style, display: '' }}></svg>;

  useEffect(() => {
    setTransformed(false);

    const ctx = rough.svg(targetRef.current!);

    for (let path of sourceRef.current!.getElementsByTagName('path')) {
      targetRef.current!.appendChild(ctx.path(path.getAttribute('d') as string, {
        strokeWidth: 0.5,
        stroke: 'currentColor',
        fill: 'currentColor',
        roughness: 0.618,
        maxRandomnessOffset: 0.9,
      }));
      targetRef.current!.setAttribute('viewBox', sourceRef.current?.getAttribute('viewBox') ?? '');
      targetRef.current!.setAttribute('class', sourceRef.current?.getAttribute('class') ?? '');
    }

    setTransformed(true);
  }, []);

  return (
    <>
      {source}
      {target}
    </>
  );
}