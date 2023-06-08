import { State } from '@/store/store';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const app = createSlice({
  name: 'app',
  initialState: () => ({
    savingNumber: 0,
    loadingNumber: 0,
  }),
  reducers: {
    startSaving: state => ({
      ...state,
      savingNumber: state.savingNumber + 1,
    }),
    stopSaving: state => ({
      ...state,
      savingNumber: state.savingNumber - 1,
    }),
    startLoading: state => ({
      ...state,
      loadingNumber: state.loadingNumber + 1,
    }),
    stopLoading: state => ({
      ...state,
      loadingNumber: state.loadingNumber - 1,
    }),
  },
});

export function useApp () {
  return useSelector<State, { loading: boolean, saving: boolean }>(state => ({
    loading: state.app.loadingNumber > 0,
    saving: state.app.savingNumber > 0,
  }));
}

export function useAppLoading () {
  return useSelector<State, boolean>(state => state.app.loadingNumber > 0);
}


export function useAppSaving () {
  return useSelector<State, boolean>(state => state.app.savingNumber > 0);
}

export default app;
