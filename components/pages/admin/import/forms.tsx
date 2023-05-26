'use client';
import { uploadLayoutJsonAction } from '@/actions/widgets';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';

export const ImportLayoutForm = ({}) => {
  return (
    <section>
      <h2>Import layout.json</h2>
      <ServerActionForm action={uploadLayoutJsonAction}>
        <ActionStateAlerts
          success={{
            title: 'Upload success',
            message: <button className="bg-green-400 text-green-900 rounded px-2" onClick={() => location.reload()}>Refresh</button>,
          }}
          pending={{
            message: 'Uploading layout.json, please do not leave this page...',
          }}
        />
        <FormControl label="Upload layout.json" name="layout.json">
          <Input type="file" />
        </FormControl>
        <div className="form-control">
          <Button>
            Import
          </Button>
        </div>
      </ServerActionForm>
    </section>
  );
};
