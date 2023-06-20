import { SiteWarnings } from '@/store/common/warnings';
import { createSlice } from '@reduxjs/toolkit';
import { shallowEqual, useSelector } from 'react-redux';
import type { State } from '../store';
import { Payload } from '../utils/types';

export enum SiteErrors {
}

type NotificationsState = {
  warnings: SiteWarnings[]
}

const notificatons = createSlice({
  name: 'notifications',
  initialState: () => ({
    warnings: [],
    errors: [],
  } as NotificationsState),
  reducers: {
    addWarning: (state, { payload: { warning } }: Payload<{ warning: SiteWarnings }>) => {
      if (state.warnings.indexOf(warning) === -1) {
        state.warnings.push(warning);
      }
    },
    dismissWarning: (state, { payload: { warning } }: Payload<{ warning: SiteWarnings }>) => {
      const idx = state.warnings.indexOf(warning);
      if (idx !== -1) {
        state.warnings.splice(idx, 1);
      }
    },
  },
});

export function useSiteWarnings () {
  return useSelector<State, SiteWarnings[]>(state => state.notifications.warnings, shallowEqual);
}

export default notificatons;
