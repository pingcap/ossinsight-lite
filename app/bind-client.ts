import { collections } from '@/packages/ui/hooks/bind';
import { Alert } from '@/src/components/Alert';
import * as internals from '@/src/layout-components';
import widgetsManifest, { ResolvedWidgetModule } from '@/src/widgets-manifest';
import { createElement, forwardRef } from 'react';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface CollectionsBindMap {
    widgets: ResolvedWidgetModule;
  }
}

export const widgets = collections.add('widgets');

for (let [name, widget] of Object.entries(widgetsManifest)) {
  widgets.define(name, async () => {
    try {
      const rawModule = await widget.module();
      return [{
        ...rawModule,
        default: forwardRef(rawModule.default),
        category: rawModule.category ?? 'Common',
        displayName: rawModule.displayName ?? name,
      } as ResolvedWidgetModule];
    } catch (e: any) {
      return [{
        default: forwardRef(({}, ref) => {
          return createElement(Alert, { type: 'error', title: 'Failed to load widget', message: String(e?.message ?? e) });
        }),
        category: 'Failed',
        displayName: name,
      }];
    }
  });
}

for (let [name, render] of Object.entries(internals)) {
  widgets.add(`internal:${name}`, {
    default: forwardRef(render),
    styleConfigurable: true,
    category: 'built-in',
    displayName: name + ' (Deprecated)',
  } satisfies ResolvedWidgetModule);
}
