'use client';

import EditWidgetInstance from '@/components/EditWidgetInstance';
import { useResolvedWidget } from '@/store/features/widgets';
import clientOnly from '@/utils/clientOnly';
import { deepCloneJson } from '@/utils/common';
import { useCallback, useState } from 'react';

function TiDBCloudPlayground () {
  const widget = useResolvedWidget('db/sql');

  const [props, setProps] = useState<any>(() => {
    return deepCloneJson({ ...widget.defaultProps });
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
