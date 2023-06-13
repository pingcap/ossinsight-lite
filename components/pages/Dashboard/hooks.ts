import { computeRowHeight, DEFAULT_ROW_HEIGHT, ROWS } from '@/components/pages/Dashboard/utils';
import { BreakpointName } from '@/utils/layout';
import { RefObject, useEffect, useLayoutEffect, useState } from 'react';
import { Layout } from 'react-grid-layout';

export function useRowHeight () {
  const [rowHeight, setRowHeight] = useState(DEFAULT_ROW_HEIGHT);
  useLayoutEffect(() => {
    setRowHeight(computeRowHeight(window.innerHeight - 56));

    const handleResize = () => {
      setRowHeight(computeRowHeight(window.innerHeight - 56));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return rowHeight;
}

export function use_unstableBreakpoint (ref: RefObject<any>) {
  const [breakpoint, setBreakpoint] = useState<BreakpointName>();

  useEffect(() => {
    if (!breakpoint) {
      // Super stupid codes
      let breakpoint: BreakpointName | undefined;
      try {
        // @ts-ignore
        breakpoint = ref.current?._reactInternals.child.stateNode.state.breakpoint;
      } catch (e) {
      }
      if (breakpoint) {
        setBreakpoint(breakpoint);
      }
    }
  }, [breakpoint]);

  return [breakpoint, setBreakpoint] as const;
}
