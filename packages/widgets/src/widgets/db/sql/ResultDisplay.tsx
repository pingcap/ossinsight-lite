import { VisualizeType } from './visualize/common';
import Visualize from './visualize/Visualize';
import { Suspense } from 'react';
import { Alert } from '../../../components/alert';

export interface ResultDisplayProps {
  editing?: boolean;
  result?: any;
  running?: boolean;
  error?: unknown;
  visualize?: VisualizeType;
  portal?: HTMLDivElement | null;
}

export default function ResultDisplay ({ editing = false, portal, visualize, result, running, error }: ResultDisplayProps) {
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
    <div className="w-full h-full flex items-center justify-center p-4">
      <Suspense fallback="Loading...">
        <Visualize {...visualize} result={result} running={running} />
      </Suspense>
    </div>
  );
}
