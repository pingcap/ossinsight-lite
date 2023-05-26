import { resolveWidgetComponents } from '@/app/dynamic-widget';
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

for (let [name, module] of Object.entries(widgetsManifest)) {
  const { Widget, ConfigureComponent, NewButton, category, displayName, ...rest } = module;
  widgets.add(name, {
    name,
    ...rest,
    ...resolveWidgetComponents(module),
    category: category ?? 'Common',
    displayName: displayName ?? name,
  });
}

for (let [name, render] of Object.entries(internals)) {
  widgets.add(`internal:${name}`, {
    Widget: forwardRef(render),
    styleConfigurable: true,
    category: 'built-in',
    name,
    displayName: name + ' (Deprecated)',
  } satisfies ResolvedWidgetModule);
}
