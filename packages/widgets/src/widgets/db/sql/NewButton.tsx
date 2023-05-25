import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import CodeSlashIcon from './code-slash.svg';
import TiDBCloudIcon from './tidbcloud.svg';

export function NewButton (props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button {...props} className={clsx('bg-gray-300 hover:bg-gray-400 transition-colors rounded px-2 py-1 flex gap-2 items-center', props.className)}>
      <TiDBCloudIcon width={14} height={14} />
      <span className="text-gray-700 text-sm font-mono">
        <CodeSlashIcon width={14} height={14} />
      </span>
    </button>
  );
}
