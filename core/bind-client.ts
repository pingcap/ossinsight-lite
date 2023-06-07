import { Alert } from '@/components/Alert';
import * as internals from '@/components/internal-widgets';
import { appState, withAppStateLoadingState } from '@/core/bind';
// import { appState, startAppStateLoadingTransition, withAppStateLoadingState } from '@/core/bind';
import widgetsManifest, { ResolvedWidgetModule } from '@/core/widgets-manifest';
import { collections } from '@/packages/ui/hooks/bind';
import { ReactiveValueSubject } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { createElement, forwardRef } from 'react';
import { resolveWidgetComponents } from './dynamic-widget';

if (typeof window !== 'undefined') {
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = (cb) => {
      return setTimeout(cb, 0);
    };
    window.cancelIdleCallback = clearTimeout;
  }
}

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

if (typeof window !== 'undefined') {
  void fetch('/api/refresh-token');

  setInterval(() => {
    if (document.visibilityState !== 'hidden') {
      void fetch('/api/refresh-token');
    }
  }, 5 * 60 * 1000);
}

export const reloadAuth = (): Promise<{ authenticated: boolean, playground: boolean }> => {
  const promise = fetch('/api/auth').then(res => res.json())
    .then((res) => {
      appState.update({
        ...appState.current,
        authenticated: !!res?.authenticated,
        playground: !!res?.playground,
      });
      return res;
    });
  withAppStateLoadingState(promise);
  return promise;
};
