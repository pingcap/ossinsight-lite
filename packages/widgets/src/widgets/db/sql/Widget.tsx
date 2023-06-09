'use client';

import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes, useContext, useEffect, useRef } from 'react';
import { VisualizeType } from '../../../components/visualize/common';
import ResultDisplay from './ResultDisplay';

export interface WidgetProps extends HTMLProps<HTMLDivElement> {
  // See https://github.com/vercel/next.js/issues/40769
  forwardedRef?: RefAttributes<HTMLDivElement>['ref'];

  defaultDb?: string;
  defaultSql?: string;
  currentDb?: string;
  sql?: string;
  visualize?: VisualizeType;
}

function Widget ({ defaultSql, defaultDb, sql, currentDb, visualize, forwardedRef, ...props }: WidgetProps, _forwardedRef: ForwardedRef<HTMLDivElement>) {
  const { visible, requestingData: running, data: result, onRequestData: execute, requestDataError: error } = useContext(WidgetContext);
  const firstExecuted = useRef(false);

  useEffect(() => {
    if ((sql || defaultSql) && currentDb && visible && !firstExecuted.current) {
      firstExecuted.current = true;
      execute();
    }
  }, [visible]);

  return (
    <div {...props} ref={forwardedRef}>
      <ResultDisplay visualize={visualize} running={running} error={error} result={result} title={props.title} />
    </div>
  );
}

export default forwardRef(Widget);
