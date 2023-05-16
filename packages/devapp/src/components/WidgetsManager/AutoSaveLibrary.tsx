import { withSuspense } from '@oss-widgets/ui/utils/suspense';
import { useEffect, useId } from 'react';
import { useCollection } from '@oss-widgets/ui/hooks/bind';
import { useThrottleIdle } from '@oss-widgets/ui/hooks/throttle';
import { useConfig } from './WidgetsManager';

export const AutoSaveLibrary = withSuspense(function AutoSave () {
  const id = useId();
  const library = useCollection('library');
  const { config, saveConfig: save } = useConfig();

  useEffect(() => {
    console.debug('[layout] loading cached = %o, rid = %o', !!localStorage.getItem('widgets:layout'), id);

    let addedItems = new Set<string>();

    config.library.forEach(item => {
      const key = item.id ?? item.name;
      library.add(key, item);
      addedItems.add(key);
    });

    library.markLoaded();
    console.debug(`[layout] loaded version = ${config.version}`);

    const sub = library.subscribeAll(() => {
      save();
    });

    return () => {
      sub.unsubscribe();

      library.resetLoaded();
      addedItems.forEach(key => library.del(key));
    };
  }, []);

  return null;
});
