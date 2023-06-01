'use client';

import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { Chart as ChartJs, ChartOptions, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import clsx from 'clsx';
import { forwardRef, HTMLAttributes, RefAttributes, useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import colors from 'tailwindcss/colors';
import { doDbSqlQuery } from '../../../../utils/query';

ChartJs.register(
  ...registerables,
);

export interface RemoteInfo {
  owner: string;
  repo: string;
  branch: string;
  name: string;
}

export interface WidgetProps extends HTMLAttributes<HTMLDivElement>, RemoteInfo {
  forwardedRef?: RefAttributes<HTMLDivElement>['ref'];
}

type ConfigJson = {
  'min-ossl-version': number
  title: string
  description: string
  database: string
  vis: 'chart.js'
}

type Visualization = (data: any, theme: any) => { data: CharacterData, options: ChartOptions };

const Widget = forwardRef<HTMLDivElement, WidgetProps>(function Widget ({ forwardedRef, owner, repo, branch, name, className, ...props }, _ref) {
  const info = { owner, repo, branch, name };
  const { result, loading } = useRemoteCollection(info);

  return (
    <div ref={forwardedRef} className={clsx(className, 'overflow-y-auto overflow-x-hidden p-2')} {...props}>
      {(loading || !result) ? (<LoadingIndicator />) : <Chart type={result.type} data={result.data} options={result.options} />}
    </div>
  );
});

function basePath ({ owner, repo, branch, name }: RemoteInfo) {
  return `/api/collections/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${name}/`;
}

function useRemoteCollection (info: RemoteInfo) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    const controller = new AbortController();

    async function main () {
      let res = await fetch(basePath(info) + 'config.json', { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`config.json ${res.status} ${res.statusText}`);
      }
      const config = JSON.parse(await res.text());

      res = await fetch(basePath(info) + 'template.sql', { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`template.sql ${res.status} ${res.statusText}`);
      }

      const sql = await res.text();

      const visual = await import(/* webpackIgnore: true */ basePath(info) + 'visualization.js');

      if (controller.signal.aborted) {
        throw new Error('aborted');
      }

      const result = await doDbSqlQuery({ sql, db: 'oh-my-github', force: false, use: config.database }, controller.signal);

      setResult(visual.default(result.data, { colors }));
    }

    setLoading(true);
    main().then(() => {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    });

    return () => {
      controller.abort('unmount');
    };
  }, [basePath(info)]);

  return {
    result, loading,
  };
}

export default Widget;
