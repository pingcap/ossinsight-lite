import { VisualizeType } from './visualize/common';
import Visualize from './visualize/Visualize';
import { Suspense, useContext } from 'react';
import { Alert } from '../../../components/alert';
import ChartTypeToggle from './visualize/ChartTypeToggle';
import * as Toolbar from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import RoughSvg from '@oss-widgets/roughness/components/RoughSvg';
import SlidersIcon from '../../../icons/twbs/sliders.svg';
import WidgetContext from '@oss-widgets/ui/context/widget'

export interface ResultDisplayProps {
  editing?: boolean;
  result?: any;
  running?: boolean;
  error?: unknown;
  visualize?: VisualizeType;
  onVisualizeTypeChange?: (type: VisualizeType['type']) => void;
  onClickVisualizeOptions?: () => void;
  portal?: HTMLDivElement | null;
}

export default function ResultDisplay ({ editing = false, portal, visualize, onVisualizeTypeChange, onClickVisualizeOptions, result, running, error }: ResultDisplayProps) {
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
      {editing && (
        <div className="flex gap-2">
          <ChartTypeToggle value={visualize.type} onChange={onVisualizeTypeChange} />
          <button
            className={clsx('inline-flex items-center gap-1 text-white bg-gray-500 rounded text-sm px-4')}
            disabled={running}
            onClick={onClickVisualizeOptions}
          >
            <RoughSvg>
              <SlidersIcon width={14} height={14} />
            </RoughSvg>
            Config
          </button>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <Suspense fallback="Loading...">
          <Visualize {...visualize} result={result} running={running} />
        </Suspense>
      </div>
    </div>
  );
}
