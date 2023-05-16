import { createContext } from 'react';

export const DashboardContext = createContext<{
  dashboardName: string
}>({
  dashboardName: '',
});

