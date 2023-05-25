import { collections } from '@/packages/ui/hooks/bind';
import { ReactiveValueSubject } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
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

widgets.rejectUnknownKey = true;
widgets.fallback = ((name: string) => new ReactiveValueSubject({
  default: function ({}) {
    return createElement(Alert, { type: 'error', title: 'Failed to load widget, check your repo version.' });
  } as any,
  name: name,
  displayName: name,
  category: 'Error',
})) as any;

for (let [name, widget] of Object.entries(widgetsManifest)) {
  widgets.define(name, async () => {
    try {
      const rawModule = await widget.module();
      return [{
        ...rawModule,
        name,
        default: forwardRef(rawModule.default),
        category: rawModule.category ?? 'Common',
        displayName: rawModule.displayName ?? name,
      } as ResolvedWidgetModule];
    } catch (e: any) {
      return [{
        default: forwardRef(({}, ref) => {
          return createElement(Alert, { type: 'error', title: 'Failed to load widget', message: String(e?.message ?? e) });
        }),
        name,
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
    name,
    displayName: name + ' (Deprecated)',
  } satisfies ResolvedWidgetModule);
}

for (let [name, widget] of Object.entries(widgetsManifest)) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      widgets.get(name);
    });
  } else {
    widgets.get(name);
  }
}
