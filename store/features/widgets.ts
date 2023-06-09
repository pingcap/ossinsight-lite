import { Alert } from '@/components/Alert';
import * as internals from '@/components/internal-widgets';
import { resolveWidgetComponents } from '@/core/dynamic-widget';
import { createSlice } from '@reduxjs/toolkit';
import { createElement, forwardRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import manifest, { ResolvedWidgetModule, WidgetModule } from '../../core/widgets-manifest';

export type WidgetsState = {
  pending: Record<string, WidgetModule>;
  resolved: Record<string, ResolvedWidgetModule>;
}

const widgets = createSlice({
  name: 'widgets',
  initialState: () => {
    const resolved = {} as Record<string, ResolvedWidgetModule>;
    // internal widgets
    for (let [name, render] of Object.entries(internals)) {
      resolved[`internal:${name}`] = {
        Widget: forwardRef(render),
        category: 'built-in',
        name,
        displayName: name + ' (Deprecated)',
      } satisfies ResolvedWidgetModule;
    }
    return {
      pending: manifest,
      resolved,
    } as WidgetsState;
  },
  reducers: {
    resolve: (state, { payload: { name } }: { payload: { name: string | string[] } }) => {
      function internalResolve (name: string) {
        if (state.resolved[name]) {
          console.warn(`widget ${name} is already resolved`);
        } else if (!state.pending[name]) {
          console.error(`widget ${name} not exists`);
          state.resolved[name] = createErrorWidget(name);
        } else {
          const module = state.pending[name];
          delete state.pending[name];
          state.resolved[name] = {
            name,
            category: 'Common',
            displayName: name,
            ...module,
            ...resolveWidgetComponents(module),
          };
        }
      }

      if (typeof name === 'string') {
        internalResolve(name);
      } else {
        name.forEach(internalResolve);
      }
    },
  },
});

export function useResolvedWidgets () {
  const store = useStore<{ widgets: WidgetsState }>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(store.getState().widgets.pending).length > 0) {
      dispatch(widgets.actions.resolve({ name: Object.keys(store.getState().widgets.pending) }));
    }
  }, [])

  return useSelector<{ widgets: WidgetsState }, Record<string, ResolvedWidgetModule>>(state => {
    return state.widgets.resolved;
  });
}

export function useWidgets () {
  return useSelector<{ widgets: WidgetsState }, Record<string, WidgetModule | ResolvedWidgetModule>>(state => {
    return Object.assign({}, state.widgets.resolved, state.widgets.pending);
  });
}

export function useWidget (name: string) {
  const widget = useSelector<{ widgets: WidgetsState }, WidgetModule | ResolvedWidgetModule>(state => state.widgets.resolved[name] ?? state.widgets.pending[name]);

  return useMemo(() => {
    return widget ?? createErrorWidget(name);
  }, [name]);
}

export function useResolvedWidget (name: string) {
  const widget = useSelector<{ widgets: WidgetsState }, ResolvedWidgetModule | undefined>(state => state.widgets.resolved[name]);
  const dispatch = useDispatch();

  if (!widget) {
    // always will resolve in next render
    throw Promise.resolve().then(() => {
      dispatch(widgets.actions.resolve({ name }));
    });
  }

  return widget;
}

export function useWidgetGetData (name: string) {
  const widget = useWidget(name);
  return widget.getData;
}

function createErrorWidget (name: string): ResolvedWidgetModule {
  return {
    Widget: function ({}) {
      return createElement(Alert, { type: 'error', title: 'Failed to load widget, check your repo version.' });
    },
    name: name,
    displayName: name,
    category: 'Error',
  };
}

export default widgets;
