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

  const target = <svg ref={targetRef} {...source.props} style={{ ...source.props.style, display: '' }}></svg>;

  useEffect(() => {
    setTransformed(false);

    const ctx = rough.svg(targetRef.current!);

    for (let path of sourceRef.current!.getElementsByTagName('path')) {
      targetRef.current!.appendChild(ctx.path(path.getAttribute('d') as string, {
        strokeWidth: 0.5,
        stroke: 'currentColor',
        fill: 'currentColor',
      }));
      targetRef.current!.setAttribute('viewBox', sourceRef.current?.getAttribute('viewBox') ?? '');
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