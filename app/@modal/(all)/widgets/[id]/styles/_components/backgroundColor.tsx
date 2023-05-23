import { HexAlphaColorPicker } from 'react-colorful';
import { useStyle } from './hooks';
import { FieldProps } from '@/app/@modal/(all)/widgets/[id]/styles/_components/common';

export default function BackgroundColorPicker ({ id }: FieldProps) {
  const [backgroundColor, setBackgroundColor] = useStyle(id, 'backgroundColor', '#ffffffC0');

  return (
    <HexAlphaColorPicker
      color={backgroundColor}
      onChange={setBackgroundColor}
    />
  );
}