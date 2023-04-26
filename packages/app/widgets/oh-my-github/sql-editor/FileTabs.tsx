import React from 'react';
import clsx from 'clsx';

export function FileTabs<T extends string> ({ current, files, onChange }: { current: T, files: T[], onChange: (file: T) => void }) {
  return (
    <ul className="flex">
      {files.map(file => <FileTab active={current === file} file={file} key={file} onClick={() => onChange(file)} />)}
    </ul>
  );
}

export function FileTab ({ file, active, onClick }: { file: string, active: boolean, onClick: () => void }) {
  return (
    <li
      className={clsx(
        'px-4 py-1 text-gray-400 first-of-type:border-l-0 border-l select-none',
        active ? 'text-gray-700 bg-gray-200' : 'cursor-pointer')
      }
      onClick={onClick}
    >
      {file}
    </li>
  );
}