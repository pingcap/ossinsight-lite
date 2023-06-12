import { Command, LibraryItemCommand } from '@/core/commands';
import { nextValue, UpdateAction, UpdateContext } from '@/packages/ui/hooks/bind/utils';
import { WidgetsState } from '@/store/features/widgets';
import type { Store } from '@/store/store';
import { LibraryItem } from '@/utils/types/config';
import { createSlice } from '@reduxjs/toolkit';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector, useStore } from 'react-redux';

export type LibraryState = {
  items: Record<string, LibraryItem>
  commands: LibraryItemCommand[]
  recording: boolean
}

const library = createSlice({
  name: 'library',
  initialState: () => ({
    items: {},
    commands: [],
    recording: true,
  } as LibraryState),
  reducers: {
    load ({ items }, { payload: { library, restoreCommands = [] } }: { payload: { library: LibraryItem[], restoreCommands?: Command[] } }) {
      library.forEach(item => {
        const id = item.id ?? item.name;
        items[id] ??= item;
      });
      restoreCommands.forEach(command => {
        switch (command.type) {
          case 'update-library-item':
            Object.assign(items[command.id], command.payload);
            break;
          case 'delete-library-item':
            delete items[command.id];
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
    delete ({ items, commands, recording }, { payload: { id } }: { payload: { id: string } }) {
      if (items[id]) {
        delete items[id];
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
  },
});

export function useLibraryItem (id: string) {
  const libraryItem = useSelector<{ library: LibraryState }, LibraryItem | undefined>(state => state.library.items[id]);

  return useMemo(() => {
    return libraryItem ?? ({ id, name: 'internal:NotFound', props: {} } as LibraryItem);
  }, [libraryItem, id]);
}

export function useLibraryItemField<T> (id: string, select: (item: LibraryItem) => T) {
  return useSelector<{ library: LibraryState }, T>(state => {
    const item = state.library.items[id];
    if (item) {
      return select(item);
    } else {
      throw new Error(`Item ${id} not found`);
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
      },
    }));
  }, []);
}

export function useRemoveLibraryItem () {
  const store = useStore();

  return useCallback((id: string) => {
    store.dispatch(library.actions.delete({ id }));
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

export default library;
