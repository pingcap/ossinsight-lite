import cc from './contribution_count.sql?unique';
import cu from './curr_user.sql?unique';
import es from './earned_stars.sql?unique';
import cr from './contributed_repos.sql?unique';
import ca from './code_additions.sql?unique';
import cd from './code_deletions.sql?unique';
import cpm from './contributions_per_month.sql';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJs, Filler, Legend, LinearScale, LineElement, PointElement, TimeScale, TimeSeriesScale, Title, Tooltip as _Tooltip } from 'chart.js';
import React, { ForwardedRef, forwardRef, HTMLProps, ReactElement, useRef } from 'react';
import clsx from 'clsx';
import 'chartjs-adapter-luxon';
import colors from 'tailwindcss/colors';
import { ReactComponent as DiffAddedIcon } from '../../../icons/diff-added.svg';
import { ReactComponent as DiffRemovedIcon } from '../../../icons/diff-removed.svg';
import { ReactComponent as EyeIcon } from '../../../icons/eye.svg';
import { ReactComponent as NorthStarIcon } from '../../../icons/north-star.svg';
import { ReactComponent as RepoIcon } from '../../../icons/repo.svg';
import { ReactComponent as StarIcon } from '../../../icons/star.svg';

import '../../../src/chartjs/rough';
import RoughSvg from '../../../src/components/RoughSvg';

const { cyan, green, red, yellow } = colors;

const lineColors = [
  red['500'],
  green['500'],
  yellow['500'],
  cyan['500'],
];

const areaColors = [
  red['200'],
  green['200'],
  yellow['200'],
  cyan['200'],
];

ChartJs.register(
  TimeScale,
  TimeSeriesScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  _Tooltip,
  Legend,
  Filler,
);

export default function Widget (props: HTMLProps<HTMLDivElement>) {
  const root = useRef<HTMLDivElement>(null);

  return (
    <div ref={root} {...props} className={clsx(props.className, 'bg-white flex flex-col p-4 gap-4 relative font-[CabinSketch]')}>
      <div className="flex gap-2">
        <img
          className="block rounded-xl w-12 h-12"
          alt={cu.login} src={`https://github.com/${cu.login}.png`}
        />
        <div className="flex flex-col">
          <span className="text-gray-700">@{cu.login}</span>
          <span className="text-gray-500">{cu.bio}</span>
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {cells.map(cell => (
          <Tooltip.Provider key={cell.key}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Cell {...cell} />
              </Tooltip.Trigger>
              <Tooltip.Portal container={root.current}>
                <Tooltip.Content
                  className="data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-gray-700 select-none rounded-[4px] bg-white px-3 py-2 leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                  side="bottom"
                  sideOffset={5}
                >
                  {cell.key}
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </ul>
      <div className="flex-1">
        <Line
          width="100%"
          height="100%"
          data={{
            labels: ['issue', 'pull_request', 'issue_comment', 'commit_comment'],
            datasets: ['issue', 'pull_request', 'issue_comment', 'commit_comment'].map((dim, index) => ({
              data: cpm
                .filter(x => x.type === dim)
                .map(({ month, cnt }) => ({
                  x: month,
                  y: cnt,
                })),
              label: dim,
              borderColor: lineColors[index],
              borderWidth: 1,
              pointRadius: 0,
              backgroundColor: areaColors[index] + 'c0',
              fill: true,
            })),
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                axis: 'x',
                type: 'time',
                min: cpm[0].month,
                max: cpm[cpm.length - 1].month,
                time: {},
                adapters: {
                  date: {
                    locale: 'en',

                  },
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  boxHeight: 4,
                  boxPadding: 0,
                  textAlign: 'left',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

const cells: CellProps[] = [
  { key: 'Contribution Count', field: <NorthStarIcon width={16} height={16} />, value: cc.contribution_count },
  { key: 'Earned Stars', field: <StarIcon width={16} height={16} />, value: es.earned_stars },
  { key: 'Followers Count', field: <EyeIcon width={16} height={16} />, value: cu.followers_count },
  { key: 'Contributed Repos', field: <RepoIcon width={16} height={16} />, value: cr.contributed_repos },
  { key: 'Code Addition', field: <DiffAddedIcon width={16} height={16} className="text-green-400" />, value: ca.code_additions },
  { key: 'Code Deletions', field: <DiffRemovedIcon width={16} height={16} className="text-red-400" />, value: cd.code_deletions },
];

type CellProps = {
  key: string
  field: ReactElement
  value: any
}

const Cell = forwardRef(function Cell ({ field, value, ...props }: CellProps & HTMLProps<HTMLLIElement>, ref: ForwardedRef<HTMLLIElement>) {
  return (
    <li ref={ref} {...props} className={clsx(props.className, 'flex items-center gap-1')}>
      <span className="text-gray-500 flex items-center">
        <RoughSvg>
          {field}
        </RoughSvg>
      </span>
      <span className="text-gray-700 font-bold">{format(value)}</span>
    </li>
  );
});

const fmt = new Intl.NumberFormat('en');

const format = (num: number) => {
  return fmt.format(num);
};
