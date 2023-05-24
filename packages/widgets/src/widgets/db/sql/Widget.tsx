import { ForwardedRef, HTMLProps, useEffect } from 'react';
import { VisualizeType } from '../../../components/visualize/common';
import { useOperation } from '../../../utils/operation';
import { doDbSqlQuery } from '../../../utils/query';
import ResultDisplay from './ResultDisplay';

export enum WidgetMode {
  EDITOR = 'editor',
  VISUALIZATION = 'visualization',
}

export interface WidgetProps extends HTMLProps<HTMLDivElement> {
  defaultDb?: string;
  defaultSql?: string;
  currentDb?: string;
  sql?: string;
  /** @deprecated */
  mode?: WidgetMode;
  visualize?: VisualizeType;
  onPropChange?: (name: string, value: any) => void;
}

export default function Widget ({ defaultSql, defaultDb, sql, currentDb, visualize, mode, ...props }: WidgetProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const { execute, running, result, error } = useOperation<{ sql: string, db: string, force: boolean }, any>(doDbSqlQuery);

  useEffect(() => {
    if ((sql || defaultSql) && currentDb) {
      execute({ sql: sql || defaultSql, db: currentDb, force: false });
    }
  }, []);

  return (
    <div {...props} ref={forwardedRef}>
      <ResultDisplay visualize={visualize} running={running} error={error} result={result} />
    </div>
  );
}
