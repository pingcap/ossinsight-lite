import { VisualizeType } from './visualize/common';
import Visualize from './visualize/Visualize';
import VisualizeConfig from './visualize/VisualizeConfig';
import { Suspense } from 'react';
import { Form } from '@oss-widgets/ui/components/form';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { VisualizeContext } from './visualize/context';

export interface ResultDisplayProps {
  editing?: boolean;
  result?: any;
  running?: boolean;
  error?: unknown;
  visualize?: VisualizeType;
  onVisualizeChange?: (visualize: DeepPartial<VisualizeType>) => void;
  portal?: HTMLDivElement | null;
}

export default function ResultDisplay ({ editing = false, portal, visualize, result, running, error, onVisualizeChange }: ResultDisplayProps) {
  if (!editing) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Suspense fallback="Loading...">
          <Visualize {...visualize} result={result} running={running} />
        </Suspense>
      </div>
    );
  }

  return (
    <VisualizeContext.Provider value={{ result: result?.data, running, error, portal, columns: result?.columns }}>
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex-1 flex items-center justify-center">
          {visualize ? <Visualize {...visualize} result={result} running={running} /> : <pre className="overflow-auto">{JSON.stringify(result, undefined, 2)}</pre>}
        </div>
        <div className="max-h-[320px] min-h-[240px] w-full p-4 border-t">
          <Form className="max-h-full overflow-auto" values={visualize} onChange={onVisualizeChange}>
            <Suspense fallback="Loading...">
              <VisualizeConfig {...visualize} />
            </Suspense>
          </Form>
        </div>
      </div>
    </VisualizeContext.Provider>
  );
}
