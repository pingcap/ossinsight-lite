import OpenIndicator from '../open-indicator';
import { SelectProps } from './Select.tsx';

export const stringSelect: Pick<SelectProps<string>, 'getKey' | 'renderOption' | 'renderOptionLabel'> = {
  getKey: s => s,
  renderOption: s => s,
  renderOptionLabel: (s, open) => (
    <span className="inline-flex gap-2 items-center">
      <span>{s}</span>

      <OpenIndicator width={10} height={10} open={open} />
    </span>
  ),
};
