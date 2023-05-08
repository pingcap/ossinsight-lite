import { getValue, VisualizeRuntimeProps, VisualizeValue } from './common';
import { useMemo } from 'react';
import AnimatedNumber from 'react-awesome-animated-number';

export default function ValueVisualize ({ title, path, result }: VisualizeValue & VisualizeRuntimeProps) {
  const value = useMemo(() => {
    return getValue(result, ['data', ...path]) ?? 0;
  }, [result, path]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-lg text-gray-400">{title}</span>
      {typeof value === 'number'
        ? <AnimatedNumber className="text-gray-700 text-xl" size={20} value={value} />
        : <span className='text-gray-700 text-xl'>{value}</span>
      }
    </div>
  );
}