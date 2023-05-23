import { ReactNode } from 'react';
import clsx from 'clsx';

export interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: ReactNode;
  message?: ReactNode;
}

export function Alert ({ type, title, message }: AlertProps) {
  return (
    <div className={clsx('alert', `alert-${type}`)}>
      {title && <h6 className="alert-title">{title}</h6>}
      {message && <p className="alert-message">{message}</p>}
    </div>
  );
}