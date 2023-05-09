import * as Toolbar from '@radix-ui/react-toolbar';
import * as Select from '@radix-ui/react-select';
import { SelectItemProps } from '@radix-ui/react-select';
import config from 'widgets:config';
import { forwardRef } from 'react';
import clsx from 'clsx';
import SlidersIcon from '../../../icons/twbs/sliders.svg';
import RoughSvg from '@oss-widgets/roughness/components/RoughSvg';

export interface SQLEditorHeaderProps {
  onRun?: () => void;
  onVisualize?: () => void;
  running?: boolean;
  portal?: HTMLDivElement | null;
  currentDb?: string;
  onCurrentDbChange?: (db: string) => void;
}

export default function SQLEditorHeader ({ portal, currentDb, onCurrentDbChange, onRun, onVisualize, running = false }: SQLEditorHeaderProps) {
  return (
    <Toolbar.Root
      className="flex w-full min-w-max h-8 p-1 relative"
      aria-label="Editor toolbar"
    >
      <Select.Root
        value={currentDb ?? null}
        onValueChange={onCurrentDbChange}
      >
        <Select.Trigger
          className=" inline-flex items-center justify-center rounded leading-none gap-1 bg-white text-gray-700 outline-none"
          aria-label="Food"
        >
          {currentDb ? <CurrentDb db={currentDb} /> : <Fallback />}
        </Select.Trigger>
        <Select.Portal container={portal}>
          <Select.Content className="overflow-hidden bg-white rounded shadow" position="popper">
            <Select.Viewport>
              {config.db.map(db => (
                <SelectItem key={db.name} value={db.name} />
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <Toolbar.Button
        className={clsx('inline-flex items-center gap-1 text-white bg-gray-500 rounded ml-auto text-sm px-4')}
        disabled={running}
        onClick={onVisualize}
      >
        <RoughSvg>
          <SlidersIcon width={14} height={14} />
        </RoughSvg>
        Visualize
      </Toolbar.Button>
      <Toolbar.Button
        className={clsx('text-white bg-gray-500 rounded ml-2 text-sm px-4')}
        disabled={running}
        onClick={onRun}
      >
        Run
      </Toolbar.Button>
    </Toolbar.Root>
  );
}

const CurrentDb = ({ db }: { db: string }) => {
  return (
    <span>
      Current DB: {db}
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
      {props.value}
    </Select.Item>
  );
});
