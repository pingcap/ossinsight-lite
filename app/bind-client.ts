import { collections } from '@/packages/ui/hooks/bind';
import * as internals from '@/src/layout-components';
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

for (let [name, render] of Object.entries(internals)) {
  widgets.add(`internal:${name}`, {
    default: forwardRef(render),
    styleConfigurable: true,
  } satisfies ResolvedWidgetModule);
}
