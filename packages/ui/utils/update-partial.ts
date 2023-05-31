import { DeepPartial, FieldValues } from 'react-hook-form';

export default function updatePartial<T extends FieldValues> (origin: T, partial: DeepPartial<T>) {
  for (const key in partial) {
    if (partial[key] != null) {
      const val = partial[key];
      if (typeof partial[key] === 'object') {
        if (!origin[key]) {
          origin[key] = val as any;
        } else {
          updatePartial(origin[key], val);
        }
      } else {
        origin[key] = val as any;
      }
    }
  }
}