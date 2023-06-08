'use client';

import { Field, Form } from '@ossinsight-lite/ui/components/form';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { forwardRef, useCallback, useContext } from 'react';
import { RemoteInfo } from './utils';
import { WidgetProps } from './Widget';

const ConfigureComponent = forwardRef<HTMLDivElement, WidgetProps>(function ConfigureComponent ({ owner, repo, branch, name, forwardedRef, ...props }, ref) {
  const { onPropChange, configuring } = useContext(WidgetContext);

  const onFormChange = useCallback((info: RemoteInfo) => {
    onPropChange?.('owner', info.owner);
    onPropChange?.('repo', info.repo);
    onPropChange?.('branch', info.branch);
    onPropChange?.('name', info.name);
  }, [onPropChange]);

  return (
    <div {...props} ref={forwardedRef}>
      <Form className="p-2" values={{ owner, repo, branch, name }} onChange={onFormChange}>
        <p className="p-2 rounded mb-2 text-yellow-500 bg-yellow-50">
          This widget is still not stable, do not edit this form if unless you know what you are doing.
        </p>
        <Field
          label="Owner"
          control={<input className="text-input" placeholder="Input a remote markdown href" />}
          name="owner"
        />
        <Field
          label="Repo"
          control={<input className="text-input" placeholder="Input a remote markdown href" />}
          name="repo"
        />
        <Field
          label="Branch"
          control={<input className="text-input" placeholder="Input a remote markdown href" />}
          name="branch"
        />
        <Field
          label="Name"
          control={<input className="text-input" placeholder="Input a remote markdown href" />}
          name="name"
        />
      </Form>
    </div>
  );
});

export default ConfigureComponent;
