import ColorPicker from '@/components/ColorPicker';
import { FieldProps } from './common';
import { useStyle } from './hooks';

export default function BackgroundColorPicker ({ id }: FieldProps) {
  const [backgroundColor, setBackgroundColor] = useStyle(id, 'backgroundColor', '#ffffffC0');

  return (
    <div className="flex items-center justify-between gap-2 text-gray-700">
      <span>Background color</span>
      <ColorPicker color={backgroundColor} onColorChange={setBackgroundColor} />
    </div>
  );
}
