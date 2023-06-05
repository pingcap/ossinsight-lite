'use client';

import { CategoryScale, Chart as ChartJs, Filler, Legend, LinearScale, LineElement, PointElement, TimeScale, TimeSeriesScale, Title, Tooltip as _Tooltip } from 'chart.js';
import 'chartjs-adapter-luxon';
import clsx from 'clsx';
import { ForwardedRef, forwardRef, HTMLProps, RefAttributes } from 'react';
import { Line } from 'react-chartjs-2';
import { data, options } from './chart-options';

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

function Widget ({ forwardedRef, ...props }: HTMLProps<HTMLDivElement> & { forwardedRef: RefAttributes<HTMLDivElement>['ref'] }, _ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div {...props} ref={forwardedRef} className={clsx(props.className, 'flex flex-col p-4 gap-4 relative font-sketch')}>
      <div className="flex-1 w-full overflow-hidden">
        <Line
          width="100%"
          height="100%"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}

export default forwardRef(Widget);
