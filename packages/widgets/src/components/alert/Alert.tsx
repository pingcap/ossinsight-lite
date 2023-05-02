import { ReactElement } from 'react';

export interface AlertProps {
  icon?: ReactElement;
  title?: string;
  children: unknown;
}

export function Alert ({ icon, title, children }: AlertProps) {
  return (
    <div className="p-4 bg-red-200 text-red-950 rounded">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        {title && <h6 className="text-xl font-bold">{title}</h6>}
      </div>
      {String((children as any)?.message ?? children)}
    </div>
  );
}
