'use client';

import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { Chart as ChartJs, ChartOptions, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import clsx from 'clsx';
import { forwardRef, HTMLAttributes, RefAttributes, useContext, useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import colors from 'tailwindcss/colors';
import { Alert } from '../../../../components/alert';
import { basePath, RemoteInfo } from './utils';

ChartJs.register(
  ...registerables,
);

export interface WidgetProps extends HTMLAttributes<HTMLDivElement>, RemoteInfo {
  forwardedRef?: RefAttributes<HTMLDivElement>['ref'];
}

type Visualization = (data: any, theme: any) => { data: CharacterData, options: ChartOptions };

const Widget = forwardRef<HTMLDivElement, WidgetProps>(function Widget ({ forwardedRef, owner, repo, branch, name, className, ...props }, _ref) {
  const info = { owner, repo, branch, name };

  const { loading, error, result } = useRemoteCollection(info);
  return (
    <div ref={forwardedRef} className={clsx(className, 'overflow-y-auto overflow-x-hidden p-2')} {...props}>
      {error && (
        <Alert title="Failed to load data">
          {(error as any).message || String(error)}
        </Alert>
      )}
      {(loading || !result) ? <Loading /> : <Chart type={result.type} data={result.data} options={result.options} />}
    </div>
  );
});

function Loading () {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className='flex gap-2 items-center'>
        <LoadingIndicator />
        Loading...
      </span>
    </div>
  );
}

function useRemoteCollection (info: RemoteInfo) {
  const { data: result, requestDataError: error, requestingData: loading, onRequestData } = useContext(WidgetContext);
  const [visLoading, setVisLoading] = useState(false);
  const [visResult, setVisResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    onRequestData(controller);
    return () => {
      controller.abort('unmount');
    };
  }, [basePath(info)]);

  useEffect(() => {
    if (result) {
      const controller = new AbortController();

      async function main () {
        const visual = await import(/* webpackIgnore: true */ basePath(info) + 'visualization.js');

        if (controller.signal.aborted) {
          throw new Error('aborted');
        }

        setVisResult(visual.default(result.data, { colors }));
      }

      setVisLoading(true);
      main().then(() => {
        if (!controller.signal.aborted) {
          setVisLoading(false);
        }
      });

      return () => {
        controller.abort();
      };
    }
  }, [result]);

  return {
    result: visResult,
    loading: loading || visLoading,
    error,
  };
}

export default Widget;
