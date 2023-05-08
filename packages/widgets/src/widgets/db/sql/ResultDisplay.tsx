import { VisualizeType } from './visualize/common';
import Visualize from './visualize/Visualize';
import VisualizeConfig from './visualize/VisualizeConfig';
import { useCallback } from 'react';

export interface ResultDisplayProps {
  editing?: boolean;
  result?: any;
  running?: boolean;
  visualize?: VisualizeType;
  onVisualizeChange?: (visualize: VisualizeType) => void;
  portal?: HTMLDivElement | null
}

export default function ResultDisplay ({ editing = false, portal, visualize, result, running, onVisualizeChange }: ResultDisplayProps) {
  const onPropChange = useCallback((name: Exclude<keyof VisualizeType, 'type'>, value: any) => {
    onVisualizeChange({ ...visualize, [name]: value });
  }, [onVisualizeChange]);

  const onTypeChange = useCallback((type: VisualizeType['type']) => {
    // TODO: type migration
    onVisualizeChange({ ...visualize, type: type });
  }, [onVisualizeChange]);

  if (!editing) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {visualize ? <Visualize {...visualize} result={result} running={running} /> : <pre className="overflow-auto">{JSON.stringify(result, undefined, 2)}</pre>}
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex-1 flex items-center justify-center">
        {visualize ? <Visualize {...visualize} result={result} running={running} /> : <pre className="overflow-auto">{JSON.stringify(result, undefined, 2)}</pre>}
      </div>
      <div className="max-h-[320px] min-h-[240px] w-full p-4 border-t">
        <VisualizeConfig {...visualize} portal={portal} columns={result?.columns} running={running} onPropChange={onPropChange} onTypeChange={onTypeChange} />
      </div>
    </div>
  );
}
