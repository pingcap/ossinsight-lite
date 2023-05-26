import { Form } from '@ossinsight-lite/ui/components/form';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import updatePartial from '@ossinsight-lite/ui/utils/update-partial';
import clsx from 'clsx';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import LoadingIndicator from '../../../../../../src/components/LoadingIndicator';
import { SQLEditor, SQLEditorHeader } from '../../../components/editor/sql';
import { VisualizeType } from '../../../components/visualize/common';
import { VisualizeContext } from '../../../components/visualize/context';
import { migrate } from '../../../components/visualize/guess';
import VisualizeConfig from '../../../components/visualize/VisualizeConfig';
import { useOperation } from '../../../utils/operation';
import { doDbSqlQuery } from '../../../utils/query';
import ResultDisplay from '../sql/ResultDisplay';
import SchemaTree from './SchemaTree';

export enum WidgetMode {
  EDITOR = 'editor',
  VISUALIZATION = 'visualization',
}

export interface WidgetProps extends HTMLProps<HTMLDivElement> {
  // See https://github.com/vercel/next.js/issues/40769
  forwardedRef?: RefAttributes<HTMLDivElement>['ref']

  defaultDb?: string;
  defaultSql?: string;
  currentDb?: string;
  sql?: string;
  visualize?: VisualizeType;
}

function Editor ({ defaultSql, defaultDb, sql, currentDb, visualize, forwardedRef, ...props }: WidgetProps, _forwardedRef: ForwardedRef<HTMLDivElement>) {
  const { onPropChange, configuring } = useContext(WidgetContext);

  const [openVisualizeDialog, setOpenVisualizeDialog] = useState(false);

  const onSqlChange = useCallback((sql: string) => {
    onPropChange?.('sql', sql);
  }, [onPropChange]);

  const onCurrentDbChange = useCallback((db: string) => {
    onPropChange?.('currentDb', db);
  }, [onPropChange]);

  const onVisualizeChange = useRefCallback((partialVisualize: Partial<VisualizeType>) => {
    updatePartial(visualize, partialVisualize);
    onPropChange?.('visualize', { ...visualize });
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
      <Form className="overflow-auto p-2 text-gray-700" values={visualize} onChange={onVisualizeChange}>
        <Suspense fallback="Loading...">
          <VisualizeConfig {...visualize} />
        </Suspense>
      </Form>
    );
  }, []);

  return (
    <VisualizeContext.Provider value={{ result: result?.data, running, error, columns: result?.columns }}>
      <div ref={forwardedRef} {...props} className={clsx('relative flex gap-2 min-w-[800px]', props.className)}>
        <div className="min-w-[240px] max-w-[240px] h-full overflow-auto border-r">
          <div>
            <Suspense fallback={<LoadingIndicator />}>
              <SchemaTree db="oh-my-github" />
            </Suspense>
          </div>
        </div>
        <div className={clsx('h-full flex flex-col min-w-[820px] w-full gap-2')}>
          <SQLEditorHeader
            currentDb={currentDb}
            onCurrentDbChange={onCurrentDbChange}
            onRun={() => {
              execute({ sql, db: currentDb, force: true });
            }}
            running={running}
          />
          <div className="min-h-[240px] max-h-[320px] w-full border-b">
            <SQLEditor sql={sql} defaultSql={defaultSql} onSqlChange={onSqlChange} />
          </div>
          <div className="flex-1 w-full flex overflow-hidden">
            <div className="flex-1 justify-stretch">
              <ResultDisplay
                editing
                configuring={configuring}
                visualize={visualize}
                onVisualizeTypeChange={onVisualizeTypeChange}
                onClickVisualizeOptions={() => {
                  setOpenVisualizeDialog(true);
                }}
                running={running}
                result={result}
                error={error}
              />
            </div>
            <div className="flex-1 min-w-[240px] p-2 border-l">
              <Visualize visualize={visualize} />
            </div>
          </div>
        </div>
      </div>
    </VisualizeContext.Provider>
  );
}

export default forwardRef(Editor);
