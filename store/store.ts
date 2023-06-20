import { isDev } from '@/packages/ui/utils/dev';
import draft from '@/store/features/draft';
import notifications from '@/store/features/notifications';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import app from './features/app';
import authApi from './features/auth';
import dashboards from './features/dashboards';
import library from './features/library';
import widgets from './features/widgets';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [app.name]: app.reducer,
    [widgets.name]: widgets.reducer,
    [library.name]: library.reducer,
    [dashboards.name]: dashboards.reducer,
    [draft.name]: draft.reducer,
    [notifications.name]: notifications.reducer,
  },
  devTools: isDev,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['widgets/resolve', 'library/update', 'dashboards/update', 'library/startLoadRemoteItem'],
        // Ignore these field paths in all actions
        // Ignore these paths in the state
        ignoredPaths: [/^widgets\./, /^library\.pendingItems\./],
      },
    }).concat(authApi.middleware),
  enhancers: [],
  preloadedState: {},
});

setupListeners(store.dispatch);

export type Store = typeof store;
export type State = ReturnType<Store['getState']>
export type Action = Parameters<Store['dispatch']>[0]

export default store;
