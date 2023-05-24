import * as Toolbar from '@radix-ui/react-toolbar';
import * as Select from '@radix-ui/react-select';
import { SelectItemProps } from '@radix-ui/react-select';
import { forwardRef } from 'react';
import clsx from 'clsx';
import PlayIcon from '../../../icons/twbs/play-fill.svg';
import RoughSvg from '@ossinsight-lite/roughness/components/RoughSvg';
import RoughBox from '@ossinsight-lite/ui/components/roughness/shape/box';
import colors from 'tailwindcss/colors';

// TODO
const config = {
  "db": [
    {
      "name": "oh-my-github",
      "display": "github-personal",
      "type": "mysql",
      "env": "OH_MY_GITHUB_DATABASE_URL"
    },
    {
      "name": "repo-track",
      "display": "github-repo",
      "type": "mysql",
      "env": "REPO_TRACK_DATABASE_URL"
    }
  ]
}

export interface SQLEditorHeaderProps {
  onRun?: () => void;
  running?: boolean;
  portal?: HTMLDivElement | null;
  currentDb?: string;
  onCurrentDbChange?: (db: string) => void;
}

const dbDisplayNames: Record<string, any> = {};
config.db.forEach((db) => {
  dbDisplayNames[db.name] = db.display;
});

export function SQLEditorHeader ({ currentDb, onCurrentDbChange, onRun, running = false }: SQLEditorHeaderProps) {
  return (
    <Toolbar.Root
      className="flex w-full min-w-max h-12 p-1 px-4 relative"
      aria-label="Editor toolbar"
    >
      <Select.Root
        value={currentDb ?? null}
        onValueChange={onCurrentDbChange}
      >
        <Select.Trigger
          className=" inline-flex items-center justify-center rounded leading-none gap-1 text-gray-700 outline-none"
          aria-label="Food"
        >
          {dbDisplayNames[currentDb] ? <CurrentDb db={dbDisplayNames[currentDb]} /> : <Fallback />}
        </Select.Trigger>
        <Select.Portal className='z-20'>
          <Select.Content className="overflow-hidden bg-white rounded shadow" position="popper">
            <Select.Viewport>
              {config.db.map(db => (
                <SelectItem key={db.name} value={db.name} textValue={db.display} />
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <Toolbar.Button
        className={clsx('text-green-600 ml-auto p-2 text-sm relative overflow-visible')}
        disabled={running}
        onClick={onRun}
      >
        <span className="relative z-10 px-4 font-bold inline-flex gap-2 items-center ">
          Run
          <RoughSvg>
            <PlayIcon />
          </RoughSvg>
        </span>
        <RoughBox color={colors.green['400']} />
      </Toolbar.Button>
    </Toolbar.Root>
  );
}

const CurrentDb = ({ db }: { db: string }) => {
  return (
    <span>
      Datasource: <b>{db}</b>
    </span>
  );
};

const Fallback = () => {
  return (
    <span className="text-gray-400">
      Select database...
    </span>
  );
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => {
  return (
    <Select.Item {...props} className={clsx('text-gray-800 px-2 py-1 cursor-pointer outline-none bg-white hover:bg-gray-100 transition-colors', props.className)} ref={ref}>
      {props.textValue}
    </Select.Item>
  );
});
