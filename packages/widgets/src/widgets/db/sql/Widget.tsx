import { HTMLProps, useCallback, useEffect, useState } from 'react';
import SQLEditor from './SQLEditor';
import SQLEditorHeader from './SQLEditorHeader';
import clsx from 'clsx';
import { useSize } from '../../../utils/size';
import { useOperation } from '../../../utils/operation';
import ResultDisplay from './ResultDisplay';
import { VisualizeType } from './visualize/common';
import ResultTable from './ResultTable';
import { usePrerenderCallback } from '@oss-widgets/runtime';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import updatePartial from '@oss-widgets/ui/utils/update-partial';

export enum WidgetMode {
  EDITOR = 'editor',
  VISUALIZATION = 'visualization',
}

export interface WidgetProps extends HTMLProps<HTMLDivElement> {
  defaultDb?: string;
  defaultSql?: string;
  currentDb?: string;
  sql?: string;
  mode?: WidgetMode;
  visualize?: VisualizeType;
  onPropChange?: (name: string, value: any) => void;
}

export default function Widget ({ defaultSql, defaultDb, sql, currentDb, mode = WidgetMode.EDITOR, onPropChange, visualize, ...props }: WidgetProps) {
  const { size, ref } = useSize<HTMLDivElement>();
  const [portal, setPortal] = useState<HTMLDivElement>(null);
  const onSqlChange = useCallback((sql: string) => {
    onPropChange?.('sql', sql);
  }, [onPropChange]);

  const onCurrentDbChange = useCallback((db: string) => {
    onPropChange?.('currentDb', db);
  }, [onPropChange]);

  const onVisualizeChange = useRefCallback((partialVisualize: Partial<VisualizeType>) => {
    updatePartial(visualize, partialVisualize);
    onPropChange?.('visualize', visualize);
  });

  const { execute, running, result, error } = useOperation<{ sql: string, db: string }, any>(doQuery);

  const cb = usePrerenderCallback();
  useEffect(() => {
    if ((sql || defaultSql) && currentDb) {
      execute({ sql: sql || defaultSql, db: currentDb });
    } else {
      cb();
    }
  }, []);

  useEffect(() => {
    if (!running && (result || error)) {
      cb();
    }
  }, [running, result, error]);

  if (mode === WidgetMode.VISUALIZATION) {
    return (
      <div {...props}>
        <ResultDisplay visualize={visualize} running={running} error={error} result={result} />
      </div>
    );
  }
  return (
    <div ref={ref} {...props} className={clsx('relative', props.className)}>
      <div className="w-full h-[calc(100%-240px)] flex">
        <div className="max-w-[640px] flex flex-col w-full h-full">
          <SQLEditorHeader portal={portal} currentDb={currentDb} onCurrentDbChange={onCurrentDbChange} onRun={() => {
            execute({ sql, db: currentDb });
          }} running={running} />
          <SQLEditor sql={sql} defaultSql={defaultSql} onSqlChange={onSqlChange} />
        </div>
        <div className="flex-1 overflow-hidden border-l">
          <ResultDisplay editing portal={portal} visualize={visualize} running={running} result={result} error={error} onVisualizeChange={onVisualizeChange} />
        </div>
      </div>
      <div className="h-[240px] w-full">
        <ResultTable result={result} running={running} />
      </div>
      <div className="fixed left-0 top-0" ref={setPortal} />
    </div>
  );
}

async function doQuery (prop: { sql: string, db: string }, signal: AbortSignal): Promise<any> {
  const res = await fetch(`${process.env.OSSW_SITE_DOMAIN}/api/db/${prop.db}`, {
    method: 'post',
    body: prop.sql,
    signal,
  });
  if (res.ok) {
    return await res.json();
  } else {
    try {
      const response = await res.json();
      return Promise.reject(new Error(response?.message ?? JSON.stringify(response)));
    } catch {
      return Promise.reject(new Error(`${res.status} ${res.statusText}`));
    }
  }
}
