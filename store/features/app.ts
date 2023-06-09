import { State } from '@/store/store';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const app = createSlice({
  name: 'app',
  initialState: () => ({
    visible: true,
    savingNumber: 0,
    loadingNumber: 0,
  }),
  reducers: {
    startSaving: state => {
      state.savingNumber++;
    },
    stopSaving: state => {
      state.savingNumber--;
    },
    startLoading: state => {
      state.loadingNumber++;
    },
    stopLoading: state => {
      state.loadingNumber--;
    },
    updateVisible (state, { payload: { visible } }: { payload: { visible: boolean } }) {
      state.visible = visible;
    },
  },
});

export function useAppBusy () {
  return useSelector<State, boolean>(state => (
    state.app.loadingNumber + state.app.loadingNumber > 0 || state.draft.length > 0
  ));
}

export function useAppLoading () {
  return useSelector<State, boolean>(state => state.app.loadingNumber > 0);
}

export function useAppSaving () {
  return useSelector<State, boolean>(state => state.app.savingNumber > 0);
}

export default app;
