'use client';
import { uploadLayoutJsonAction } from '@/actions/widgets';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';

export const ImportLayoutForm = ({}) => {
  return (
    <section>
      <h2>Import template</h2>
      <ServerActionForm action={uploadLayoutJsonAction}>
        <ActionStateAlerts
          success={{
            title: 'Upload success',
            message: <button className="bg-green-400 text-green-900 rounded px-2" onClick={() => location.reload()}>Refresh</button>,
          }}
          pending={{
            message: 'Uploading template.json, please do not leave this page...',
          }}
        />
        <FormControl label="Upload template.json" name="template.json">
          <Input type="file" accept="application/json" />
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
