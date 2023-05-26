import { HexAlphaColorPicker } from 'react-colorful';
import { FieldProps } from './common';
import { useStyle } from './hooks';

export default function BackgroundColorPicker ({ id }: FieldProps) {
  const [backgroundColor, setBackgroundColor] = useStyle(id, 'backgroundColor', '#ffffffC0');

  return (
    <HexAlphaColorPicker
      color={backgroundColor}
      onChange={setBackgroundColor}
    />
  );
}