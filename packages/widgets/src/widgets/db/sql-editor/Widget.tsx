import { Form } from '@ossinsight-lite/ui/components/form';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import updatePartial from '@ossinsight-lite/ui/utils/update-partial';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { ForwardedRef, HTMLProps, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { SQLEditor, SQLEditorHeader } from '../../../components/editor/sql';
import { VisualizeType } from '../../../components/visualize/common';
import { VisualizeContext } from '../../../components/visualize/context';
import { migrate } from '../../../components/visualize/guess';
import VisualizeConfig from '../../../components/visualize/VisualizeConfig';
import { useOperation } from '../../../utils/operation';
import { doDbSqlQuery } from '../../../utils/query';
import ResultDisplay from '../sql/ResultDisplay';

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
  const { onPropChange } = useContext(WidgetContext);

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

  return (
    <div ref={forwardedRef} {...props} className={clsx('relative', props.className)}>
      <div className={clsx('w-full h-full flex flex-col')}>
        <SQLEditorHeader
          currentDb={currentDb}
          onCurrentDbChange={onCurrentDbChange}
          onRun={() => {
            execute({ sql, db: currentDb, force: true });
          }}
          running={running}
        />
        <div className="min-h-[240px] max-h-[320px] w-full">
          <SQLEditor sql={sql} defaultSql={defaultSql} onSqlChange={onSqlChange} />
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <ResultDisplay
            editing
            visualize={visualize}
            onVisualizeTypeChange={onVisualizeTypeChange}
            onClickVisualizeOptions={() => {
              setOpenVisualizeDialog(true);
            }}
            running={running}
            result={result}
            error={error}
          />
          <Dialog.Root open={openVisualizeDialog} onOpenChange={setOpenVisualizeDialog}>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="z-10 backdrop-blur data-[state=open]:animate-contentShow fixed top-[40px] left-0 max-h-[85vh] w-full p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-white m-0 text-xl font-medium">Visualization</Dialog.Title>
                <VisualizeContext.Provider value={{ result: result?.data, running, error, columns: result?.columns }}>
                  <Form className="overflow-auto p-2" values={visualize} onChange={onVisualizeChange}>
                    <Suspense fallback="Loading...">
                      <VisualizeConfig {...visualize} />
                    </Suspense>
                  </Form>
                </VisualizeContext.Provider>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
}
