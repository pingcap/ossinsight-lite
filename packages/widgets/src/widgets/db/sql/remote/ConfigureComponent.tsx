'use client';

import { Field, Form } from '@ossinsight-lite/ui/components/form';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { forwardRef, useCallback, useContext } from 'react';
import { RemoteInfo, WidgetProps } from './Widget';

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
      <Form values={{ owner, repo, branch, name }} onChange={onFormChange}>
        <Field
          label="Owner"
          control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a remote markdown href" />}
          name="owner"
        />
        <Field
          label="Repo"
          control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a remote markdown href" />}
          name="repo"
        />
        <Field
          label="Branch"
          control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a remote markdown href" />}
          name="branch"
        />
        <Field
          label="Name"
          control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a remote markdown href" />}
          name="name"
        />
      </Form>
    </div>
  );
});

export default ConfigureComponent;
