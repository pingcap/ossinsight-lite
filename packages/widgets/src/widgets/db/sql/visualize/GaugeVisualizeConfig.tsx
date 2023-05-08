import { VisualizeConfigProps, VisualizeGauge } from './common';
import { ChangeEvent, useCallback } from 'react';

export default function GaugeVisualizeConfig ({ title, onPropChange }: VisualizeGauge & VisualizeConfigProps) {
  const onTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onPropChange('title', event.target.value);
  }, [onPropChange]);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <label className="text-gray-400">Title</label>
        <input className="outline-none" value={title} placeholder="Input title..." min={1} onChange={onTitleChange} />
      </div>
      {/*<div className="flex gap-2">*/}
      {/*  <label className="text-gray-400">Field</label>*/}
      {/*  <Select.Root value={path[1] as string} onValueChange={onFieldChange}>*/}
      {/*    <Select.Trigger className="inline-flex items-center justify-center outline-none">*/}
      {/*      <Select.Value>*/}
      {/*        {path[1]}*/}
      {/*      </Select.Value>*/}
      {/*      <Select.Icon>*/}
      {/*        <RoughSvg>*/}
      {/*          <ChevronDownIcon />*/}
      {/*        </RoughSvg>*/}
      {/*      </Select.Icon>*/}
      {/*    </Select.Trigger>*/}
      {/*    <Select.Portal container={portal}>*/}
      {/*      <Select.Content className="overflow-hidden max-h-[280px] bg-white rounded shadow" position="popper">*/}
      {/*        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">*/}
      {/*          <RoughSvg>*/}
      {/*            <ChevronUpIcon />*/}
      {/*          </RoughSvg>*/}
      {/*        </Select.ScrollUpButton>*/}
      {/*        <Select.Viewport className="p-2">*/}
      {/*          {columns?.map(column => (*/}
      {/*            <ColumnItem name={column.name} key={column.name} />*/}
      {/*          ))}*/}
      {/*        </Select.Viewport>*/}
      {/*        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">*/}
      {/*          <RoughSvg>*/}
      {/*            <ChevronDownIcon />*/}
      {/*          </RoughSvg>*/}
      {/*        </Select.ScrollDownButton>*/}
      {/*      </Select.Content>*/}
      {/*    </Select.Portal>*/}
      {/*  </Select.Root>*/}
      {/*</div>*/}
    </div>
  );
}

// function ColumnItem ({ name }: { name: string }) {
//   return (
//     <Select.Item value={name} className='text-sm cursor-pointer py-1 px-2 outline-none transition-colors hover:bg-gray-100 data-[state=checked]:bg-gray-200'>
//       <Select.ItemText>
//         {name}
//       </Select.ItemText>
//       <Select.ItemIndicator className="h-full inline-flex items-center justify-center ml-2">
//         <RoughSvg>
//           <CheckIcon />
//         </RoughSvg>
//       </Select.ItemIndicator>
//     </Select.Item>
//   );
// }
