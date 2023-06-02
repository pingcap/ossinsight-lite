'use client';

import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes, useContext, useEffect, useRef } from 'react';
import { VisualizeType } from '../../../components/visualize/common';
import { useOperation } from '../../../utils/operation';
import { doDbSqlQuery } from '../../../utils/query';
import ResultDisplay from './ResultDisplay';

export enum WidgetMode {
  EDITOR = 'editor',
  VISUALIZATION = 'visualization',
}

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
  const { visible } = useContext(WidgetContext);
  const firstExecuted = useRef(false);
  const { execute, running, result, error } = useOperation<{ sql: string, db: string, force: boolean }, any>(doDbSqlQuery);

  useEffect(() => {
    if ((sql || defaultSql) && currentDb && visible && !firstExecuted.current) {
      firstExecuted.current = true;
      execute({ sql: sql || defaultSql, db: currentDb, force: false });
    }
  }, [visible]);

  return (
    <div {...props} ref={forwardedRef}>
      <ResultDisplay visualize={visualize} running={running} error={error} result={result} title={props.title} />
    </div>
  );
}

export default forwardRef(Widget);
