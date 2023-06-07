import { createContext } from 'react';

export const DashboardContext = createContext<{
  dashboardName: string
  editing: boolean
  toggleEditing (): void
}>({
  dashboardName: '',
  editing: false,
  toggleEditing () {},
});

