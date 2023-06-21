import { useMemo } from 'react';
import AnimatedNumber from 'react-awesome-animated-number';
import { VisualizeGauge, VisualizeRuntimeProps } from './common';

export default function GaugeVisualize ({ title, running, result }: VisualizeGauge & VisualizeRuntimeProps) {
  const value = useMemo(() => {
    if (result) {
      return result.data[0]?.[result.columns[0].name];
    } else {
      return 0;
    }
  }, [result]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-lg text-gray-400">{title}</span>
      {typeof value === 'number'
        ? <AnimatedNumber className="text-gray-700 text-xl" size={20} value={value} />
        : <span className="text-gray-700 text-xl">{value}</span>
      }
    </div>
  );
}