import { collections } from '@/packages/ui/hooks/bind';
import widgetsManifest, { ResolvedWidgetModule } from '@/src/widgets-manifest';
import { forwardRef } from 'react';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface CollectionsBindMap {
    widgets: ResolvedWidgetModule;
  }
}

export const widgets = collections.add('widgets');

for (let [name, widget] of Object.entries(widgetsManifest)) {
  widgets.define(name, async () => {
    const rawModule = await widget.module();
    return [{
      ...rawModule,
      default: forwardRef(rawModule.default),
    } as ResolvedWidgetModule];
  });
}