import OpenIndicator from '@ossinsight-lite/ui/components/open-indicator';
import { Select } from '@ossinsight-lite/ui/components/select';
import AppContext from '@ossinsight-lite/ui/context/app';
import * as Toolbar from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import { useContext } from 'react';
import PlayIcon from '../../../icons/twbs/play-fill.svg';

// TODO
const config = {
  'db': [
    {
      'name': 'oh-my-github',
      'display': 'github_personal',
      'type': 'mysql',
      'env': 'OH_MY_GITHUB_DATABASE_URL',
    },
    {
      'name': 'repo-track',
      'display': 'github_repos',
      'type': 'mysql',
      'env': 'REPO_TRACK_DATABASE_URL',
    },
  ],
};

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

const getSelf = (k: string) => k;

export function SQLEditorHeader ({ currentDb, onCurrentDbChange, onRun, running = false }: SQLEditorHeaderProps) {
  const { availableDatabaseNames, getDatabaseByName } = useContext(AppContext);

  return (
    <Toolbar.Root
      className="flex w-full min-w-max px-[10px] relative"
      aria-label="Editor toolbar"
    >
      <Select
        value={currentDb}
        onValueChange={onCurrentDbChange}
        options={availableDatabaseNames}
        getKey={getSelf}
        renderOption={getDatabaseByName}
        renderOptionLabel={(value, open) => (
          <span className="inline-flex items-center font-mono gap-2 text-sm">
            <span>
              <span className="text-[#8959a8] mr-2">USE</span>
              {getDatabaseByName(value)}
            </span>
            <OpenIndicator open={open} width={10} height={10} />;
          </span>
        )}
      />
      <Toolbar.Button
        className={clsx('btn btn-green ml-auto font-bold')}
        disabled={running}
        onClick={onRun}
      >
        Run
        <PlayIcon />
      </Toolbar.Button>
    </Toolbar.Root>
  );
}

const CurrentDb = ({ db }: { db: string }) => {
  return (
    <span>
      USE <b>{db}</b>
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
