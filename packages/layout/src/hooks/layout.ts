import type { Layout } from '../core/layout/base';
import { useEffect, useState } from 'react';

export function useLayout<
  Cls extends { new (options: O): T },
  T extends Layout<any, any> & { updateOptions (options: O): void },
  O
> (cls: Cls, opts: O): T {
  const [layout] = useState(() => new cls(opts));

  useEffect(() => {
    layout.updateOptions(opts);
  }, [opts]);

  return layout;
}