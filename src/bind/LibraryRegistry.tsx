import { useEffect } from 'react';
import { useReactBindCollections } from '@/packages/ui/hooks/bind';
import { useConfig } from '@/src/components/WidgetsManager';
import clientOnly from '@/src/utils/clientOnly';

function LibraryRegistry () {
  const collections = useReactBindCollections();
  const { config } = useConfig();

  useEffect(() => {
    const library = collections.add('library');
    library.needLoaded();

    config.library.forEach(item => {
      const key = item.id ?? item.name;
      library.add(key, item);
    });

    library.markLoaded();
    return () => {
      if (config && library.isNeedLoaded) {
        console.debug(`[layout] loaded version = ${config.version}`);
        library.resetLoaded();
      }
      collections.del('library')
    };
  }, []);

  return null;
}

export default clientOnly(LibraryRegistry);
