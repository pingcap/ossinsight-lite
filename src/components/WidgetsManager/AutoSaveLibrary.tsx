'use client';
import { useEffect, useId } from 'react';
import { useCollection } from '@ossinsight-lite/ui/hooks/bind';
import { useConfig } from './WidgetsManager';
import clientOnly from '@/src/utils/clientOnly';

function AutoSave () {
  const id = useId();
  const library = useCollection('library');
  const { config, saveConfig: save } = useConfig();

  useEffect(() => {
    console.debug('[layout] loading cached = %o, rid = %o', !!localStorage.getItem('widgets:layout'), id);
    const sub = library.subscribeAll((ev) => {
      save('library changed');
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return null;
}

export default clientOnly(AutoSave);
