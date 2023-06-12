import { createSlice } from '@reduxjs/toolkit';
import { Command, merge } from '../../core/commands';

export type DraftState = {
  dirty: Command[]
  committing: Command[]
  localStorageUncommittedChanges: Command[]
}

const LOCAL_STORAGE_KEY_DATA = 'ossinsight-lite.uncommitted-changes';
const LOCAL_STORAGE_KEY_TS = 'ossinsight-lite.uncommitted-changes-last-updated';

export const draft = createSlice({
  name: 'draft',
  initialState: () => {
    let localStorageUncommittedChanges: Command[] = [];
    if (typeof localStorage !== 'undefined') {
      try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY_DATA);
        if (data) {
          localStorageUncommittedChanges = JSON.parse(data);
        }
      } catch (e) {
      }
    }
    return {
      dirty: [],
      committing: [],
      localStorageUncommittedChanges,
    } as DraftState;
  },
  reducers: {
    add (state, { payload: { command } }: { payload: { command: Command | Command[] } }) {
      if (command instanceof Array) {
        state.dirty.push(...command);
      } else {
        state.dirty.push(command);
      }
    },
    startCommitting (state) {
      if (state.committing.length > 0) {
        throw new Error('bad state');
      }
      state.committing = state.dirty;
      state.dirty = [];
    },
    commit (state, { payload: { clearUncommitted } }: { payload: { clearUncommitted: boolean } }) {
      state.committing = [];
      if (clearUncommitted) {
        localStorage.removeItem(LOCAL_STORAGE_KEY_DATA);
        localStorage.removeItem(LOCAL_STORAGE_KEY_TS);
        state.localStorageUncommittedChanges = [];
      }
    },
    rollback (state) {
      state.dirty.splice(0, 0, ...state.committing);
      state.committing = [];
    },
    addLocalStorageUncommittedChanges (state, { payload: { commands } }: { payload: { commands: Command[] } }) {
      const mergedCommands = merge([...state.localStorageUncommittedChanges, ...commands]);
      state.localStorageUncommittedChanges = mergedCommands;
      localStorage.setItem(LOCAL_STORAGE_KEY_DATA, JSON.stringify(mergedCommands));
      localStorage.setItem(LOCAL_STORAGE_KEY_TS, String(Date.now()));
    },
  },
});

export default draft;
