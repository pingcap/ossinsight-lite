'use client';

import { Form } from '@ossinsight-lite/ui/components/form';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import clsx from 'clsx';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes, Suspense, useCallback, useContext, useEffect, useMemo } from 'react';
import { SQLEditor, SQLEditorHeader } from '../../../components/editor/sql';
import ChartTypeToggle from '../../../components/visualize/ChartTypeToggle';
import { VisualizeType } from '../../../components/visualize/common';
import { VisualizeContext } from '../../../components/visualize/context';
import { migrate } from '../../../components/visualize/guess';
import VisualizeConfig from '../../../components/visualize/VisualizeConfig';
import { useOperation } from '../../../utils/operation';
import { doDbSqlQuery } from '../../../utils/query';
import ResultDisplay from '../sql/ResultDisplay';
import SchemaTree from './SchemaTree';

export interface WidgetProps extends HTMLProps<HTMLDivElement> {
  // See https://github.com/vercel/next.js/issues/40769
  forwardedRef?: RefAttributes<HTMLDivElement>['ref'];

  defaultDb?: string;
  defaultSql?: string;
  currentDb?: string;
  sql?: string;
  visualize?: VisualizeType;
}

function Editor ({ defaultSql, defaultDb, sql, currentDb, forwardedRef, ...props }: WidgetProps, _forwardedRef: ForwardedRef<HTMLDivElement>) {
  const { props: { visualize }, onPropChange, configuring } = useContext(WidgetContext);

  const onSqlChange = useCallback((sql: string) => {
    onPropChange?.('sql', sql);
  }, [onPropChange]);

  const onCurrentDbChange = useCallback((db: string) => {
    onPropChange?.('currentDb', db);
  }, [onPropChange]);

  const onVisualizeChange = useRefCallback((visualize: VisualizeType) => {
    onPropChange?.('visualize', visualize);
  });

  const onVisualizeTypeChange = useRefCallback((type: VisualizeType['type']) => {
    if (!result) {
      return;
    }
    onPropChange?.('visualize', migrate(visualize, type, result));
  });

  const { execute, running, result, error } = useOperation<{ sql: string, db: string, force: boolean }, any>(doDbSqlQuery);

  useEffect(() => {
    if ((sql || defaultSql) && currentDb) {
      execute({ sql: sql || defaultSql, db: currentDb, force: false });
    }
  }, []);

  const Visualize = useMemo(() => ({ visualize }: { visualize: VisualizeType }) => {
    return (
      <Form className="overflow-hidden p-2 text-gray-700 max-w-[260px] horizontal-form-controls" values={visualize} onChange={onVisualizeChange}>
        <Suspense fallback="Loading...">
          <VisualizeConfig {...visualize} />
        </Suspense>
      </Form>
    );
  }, []);

  const runSql = useRefCallback(() => {
    execute({ sql, db: currentDb, force: true });
  });

  const selectedColumns = useMemo(() => {
    switch (visualize.type) {
      case 'chart:line':
      case 'chart:bar':
        return [visualize.x.field, visualize.y.field];
      default:
        return undefined;
    }
  }, [visualize]);

  return (
    <VisualizeContext.Provider value={{ result: result?.data, running, error, columns: result?.columns, selectedColumns }}>
      <div ref={forwardedRef} {...props} className={clsx('relative flex gap-2 min-w-[88vw]', props.className)}>
        <div className="h-full min-w-[240px] max-w-[240px] overflow-auto border-r">
          <div>
            <Suspense fallback={<LoadingIndicator />}>
              <SchemaTree db="oh-my-github" />
            </Suspense>
          </div>
        </div>
        <div className={clsx('h-full flex flex-col w-full gap-2')}>
          <SQLEditorHeader
            currentDb={currentDb}
            onCurrentDbChange={onCurrentDbChange}
            onRun={runSql}
            running={running}
          />
          <div className="min-h-[240px] max-h-[320px] w-full overflow-hidden border-b">
            <SQLEditor sql={sql} defaultSql={defaultSql} onSqlChange={onSqlChange} onCommand={runSql} />
          </div>
          <div className="flex-1 w-full flex overflow-hidden">
            <div className="flex-1 justify-stretch overflow-hidden">
              <ResultDisplay
                editing
                configuring={configuring}
                visualize={visualize}
                running={running}
                result={result}
                error={error}
                title={props.title}
              />
            </div>
            <div className="p-2 border-l text-sm text-gray-700">
              <ChartTypeToggle value={visualize.type} onChange={onVisualizeTypeChange} />
              <Visualize visualize={visualize} />
            </div>
          </div>
        </div>
      </div>
    </VisualizeContext.Provider>
  );
}

export default forwardRef(Editor);
