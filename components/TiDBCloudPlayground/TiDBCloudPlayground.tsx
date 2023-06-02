'use client';

import EditWidgetInstance from '@/components/EditWidgetInstance';
import { widgets } from '@/core/bind-client';
import { readItem } from '@/packages/ui/hooks/bind';
import clientOnly from '@/utils/clientOnly';
import { useCallback, useState } from 'react';

function TiDBCloudPlayground () {
  const widget = readItem(widgets, 'db/sql');

  const [props, setProps] = useState<any>(() => {
    return widget.current.defaultProps;
  });

  const handleChange = useCallback((key: string, value: any) => {
    setProps((props: any) => {
      return ({
        ...props,
        [key]: value,
      });
    });
  }, []);

  return (
    <EditWidgetInstance name="db/sql" props={props} onPropsChange={handleChange} disableTitle />
  );
}

export default clientOnly(TiDBCloudPlayground);
