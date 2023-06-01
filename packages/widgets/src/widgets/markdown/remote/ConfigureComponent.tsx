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
      <Form className='p-2' values={{ href }} onChange={onFormChange}>
        <p className="p-2 rounded mb-2 text-yellow-500 bg-yellow-50">
          This widget is still not stable, do not edit this form if unless you know what you are doing.
        </p>
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
