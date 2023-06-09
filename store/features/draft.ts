import { createSlice } from '@reduxjs/toolkit';
import { Command } from '../../core/commands';

export type DraftState = {
  dirty: Command[]
  committing: Command[]
}

export const draft = createSlice({
  name: 'draft',
  initialState: () => ({
    dirty: [],
    committing: [],
  } as DraftState),
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
    commit (state) {
      state.committing = [];
    },
    rollback (state) {
      state.dirty.splice(0, 0, ...state.committing);
      state.committing = [];
    },
  },
});

export default draft;
