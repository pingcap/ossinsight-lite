'use client';

import { Field, Form } from '@ossinsight-lite/ui/components/form';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { forwardRef, useCallback, useContext } from 'react';
import { WidgetProps } from './Widget';

const ConfigureComponent = forwardRef<HTMLDivElement, WidgetProps>(function ConfigureComponent ({ href, forwardedRef, ...props }, ref) {
  const { onPropChange, configuring } = useContext(WidgetContext);

  const onFormChange = useCallback(({ href }: { href: string }) => {
    onPropChange?.('href', href);
  }, [onPropChange]);

  return (
    <div {...props} ref={forwardedRef}>
      <Form values={{ href }} onChange={onFormChange}>
        <Field
          label="Href"
          control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a remote markdown href" />}
          name="href"
        />
      </Form>
    </div>
  );
});

export default ConfigureComponent;
