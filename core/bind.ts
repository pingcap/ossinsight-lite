import { BatchCommands } from '@/core/commands';
import { collections } from '@/packages/ui/hooks/bind/context';
import { BindingTypeEvent } from '@/packages/ui/hooks/bind/types';

export const dashboards = collections.add('dashboards');

export const library = collections.add('library');

export const commands = new BatchCommands();

// Auto save library items
library.subscribeAll(([item, id, ev]) => {
  switch (ev) {
    case BindingTypeEvent.CREATED:
    case BindingTypeEvent.UPDATED:
      commands.add({
        type: 'update-library-item',
        id: id as string,
        payload: item,
      });
      break;
    case BindingTypeEvent.DELETED:
      commands.add({
        type: 'delete-library-item',
        id: id as string,
      });
      break;
  }
});

// Auto save dashboard items
dashboards.subscribeAll(([dashboard, id, ev]) => {
  if (ev === BindingTypeEvent.CREATED) {
    dashboard.addDisposeDependency(dashboard.items.subscribeAll(([item, id, ev]) => {
      switch (ev) {
        case BindingTypeEvent.CREATED:
        case BindingTypeEvent.UPDATED:
          commands.add({
            type: 'update-dashboard-item',
            dashboard: dashboard.name,
            id: id as string,
            payload: item,
          });
          break;
        case BindingTypeEvent.DELETED:
          commands.add({
            type: 'delete-dashboard-item',
            dashboard: dashboard.name,
            id: id as string,
          });
          break;
      }
    }));
  }
});
