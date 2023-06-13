import { Suspense } from 'react';
import { Alert } from '../../../components/alert';
import { VisualizeType } from '../../../components/visualize/common';
import Visualize from '../../../components/visualize/Visualize';

export interface ResultDisplayProps {
  title?: string
  editing?: boolean;
  result?: any;
  running?: boolean;
  error?: unknown;
  configuring?: boolean;
  visualize?: VisualizeType;
  portal?: HTMLDivElement | null;
}

export default function ResultDisplay ({ title, editing = false, configuring, portal, visualize, result, running, error }: ResultDisplayProps) {
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Alert title="Failed to execute SQL">
          {error}
        </Alert>
      </div>
    );
  }
  return (
    <div className={'w-full h-full flex flex-col gap-2 p-4'}>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Suspense fallback="Loading...">
          <Visualize {...visualize} result={result} running={running} title={title} />
        </Suspense>
      </div>
    </div>
  );
}
