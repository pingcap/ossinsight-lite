import { Command, LibraryItemCommand } from '@/core/commands';
import { nextValue, UpdateAction, UpdateContext } from '@/packages/ui/hooks/bind/utils';
import { WidgetsState } from '@/store/features/widgets';
import type { Store } from '@/store/store';
import { LibraryItem } from '@/utils/types/config';
import { createSlice } from '@reduxjs/toolkit';
import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useStore } from 'react-redux';

export type LibraryState = {
  items: Record<string, LibraryItem>
  pendingItems: Record<string, Promise<void>>
  deletedItems: Record<string, boolean>
  errorItems: Record<string, unknown>
  commands: LibraryItemCommand[]
  recording: boolean
}

const library = createSlice({
  name: 'library',
  initialState: () => ({
    items: {},
    pendingItems: {},
    deletedItems: {},
    errorItems: {},
    commands: [],
    recording: true,
  } as LibraryState),
  reducers: {
    load ({ items, deletedItems }, { payload: { library, restoreCommands = [] } }: { payload: { library: LibraryItem[], restoreCommands?: Command[] } }) {
      library.forEach(item => {
        const id = item.id ?? item.name;
        items[id] ??= item;
      });
      restoreCommands.forEach(command => {
        switch (command.type) {
          case 'update-library-item':
            if (items[command.id]) {
              Object.assign(items[command.id], command.payload);
            }
            break;
          case 'delete-library-item':
            delete items[command.id];
            deletedItems[command.id] = true;
            break;
          default:
            break;
        }
      });
    },
    update ({ items, commands, recording }, { payload: { id, item } }: { payload: { id: string, item: UpdateAction<LibraryItem> } }) {
      const ctx = { changed: true } as UpdateContext<LibraryItem>;
      const nextVal = nextValue(items[id], item, ctx);
      if (ctx.changed) {
        items[id] = nextVal;
        if (recording) {
          commands.push({
            type: 'update-library-item',
            id,
            payload: nextVal,
          });
        }
      }
    },
    add ({ items, commands, recording }, { payload: { item } }: { payload: { item: LibraryItem | LibraryItem[] } }) {
      function addInternal (item: LibraryItem) {
        const id = item.id ?? item.name;
        if (items[id]) {
          console.warn(`item#${id} already exists`);
          return;
        }
        items[id] = item;
        if (recording) {
          commands.push({
            type: 'update-library-item',
            id,
            payload: item,
          });
        }
      }

      if (item instanceof Array) {
        item.forEach(addInternal);
      } else {
        addInternal(item);
      }
    },
    delete ({ items, deletedItems, commands, recording }, { payload: { id } }: { payload: { id: string } }) {
      if (items[id]) {
        delete items[id];
        deletedItems[id] = true;
        if (recording) {
          commands.push({
            type: 'delete-library-item',
            id,
          });
        }
      }
    },

    startRecording (state) {
      state.recording = true;
    },

    stopRecording (state) {
      state.recording = false;
    },

    clearCommands (state) {
      state.commands = [];
    },

    startLoadRemoteItem (state, { payload: { id, promise } }: { payload: { id: string, promise: Promise<void> } }) {
      if (state.items[id]) {
        console.warn(`Library item ${id} was already loaded.`);
        return;
      }
      if (!!state.pendingItems[id]) {
        console.warn(`Library item ${id} was already requested to load.`);
        return;
      }
      if (!!state.errorItems[id]) {
        return;
      }
      state.pendingItems[id] = promise;
    },
    loadRemoteItem (state, { payload: { id, item } }: { payload: { id: string, item: LibraryItem } }) {
      if (state.items[id]) {
        console.warn(`Library item ${id} was already loaded.`);
        return;
      }
      delete state.pendingItems[id];
      delete state.errorItems[id];
      state.items[id] = item;
    },
    loadRemoteItemFailed (state, { payload: { id, error } }: { payload: { id: string, error: unknown } }) {
      if (state.items[id]) {
        console.warn(`Library item ${id} was already loaded.`);
        return;
      }
      delete state.pendingItems[id];
      state.errorItems[id] = error;
    },
  },
});

const DELETED_PROMISE = new Promise(() => {});

export function useLibraryItemField<T> (id: string, select: (item: LibraryItem) => T) {
  const store: Store = useStore();
  return useSelector<{ library: LibraryState }, T>(state => {
    const deleted = state.library.deletedItems[id];
    if (deleted) {
      throw DELETED_PROMISE;
    }
    const item = state.library.items[id];
    if (item) {
      return select(item);
    } else {
      throw scheduleLoadLibraryItem(store, id);
    }
  });
}

export function useAddLibraryItem () {
  const store = useStore<{ library: LibraryState, widgets: WidgetsState }>();

  return useCallback((item: LibraryItem) => {
    const { widgets } = store.getState();
    const widget = widgets.pending[item.name] || widgets.resolved[item.name];
    if (!widget) {
      console.warn(`Unknown widget ${item.name}`);
    }

    store.dispatch(library.actions.add({
      item: {
        ...item,
        props: {
          ...widget?.defaultProps,
          ...item.props,
        },
        visibility: 'public',
      },
    }));
  }, []);
}

export function useUpdateLibraryItem () {
  const store = useStore();

  return useCallback((id: string, item: UpdateAction<LibraryItem>) => {
    store.dispatch(library.actions.update({ id, item }));
  }, []);
}

export function useInitialLoadLibraryItems (store: Store, items: LibraryItem[], effect = false) {
  if (effect) {
    useEffect(() => {
      store.dispatch(library.actions.load({ library: items, restoreCommands: store.getState().draft.localStorageUncommittedChanges }));
    }, []);
  } else {
    const init = useRef(false);
    if (!init.current) {
      store.dispatch(library.actions.load({ library: items, restoreCommands: store.getState().draft.localStorageUncommittedChanges }));
    }
    useEffect(() => {
      init.current = true;
    }, []);
  }
}

function scheduleLoadLibraryItem (store: Store, id: string): Promise<void> {
  console.trace('schedule');
  const libraryState = store.getState().library;
  const pendingItem = libraryState.pendingItems[id];
  if (!!pendingItem) {
    return pendingItem;
  }

  const errorItem = libraryState.errorItems[id];
  if (!!errorItem) {
    return Promise.reject(errorItem);
  }

  const promise = new Promise<LibraryItem>(async (resolve, reject) => {
    setTimeout(() => {
      store.dispatch(library.actions.startLoadRemoteItem({
        id,
        promise,
      }));
    }, 0);

    try {
      const res = await fetch(`/api/library/${encodeURIComponent(id)}`);
      if (!res.ok) {
        reject(new Error(`${res.status} ${res.statusText}`));
        return;
      }
      const data = await res.json();
      resolve(data);
    } catch (e) {
      reject(e);
    }
  })
    .then((item) => {
      store.dispatch(library.actions.loadRemoteItem({ id, item }));
    })
    .catch((error) => {
      store.dispatch(library.actions.loadRemoteItemFailed({ id, error }));
    });
  return promise;
}

export default library;
