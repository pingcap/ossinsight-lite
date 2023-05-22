import './layout.css';
import App from '@/src/App';
import React from 'react';
import { serverDashboardNames } from '@/app/(client)/api/layout/operations.server';

export default async function ({ children }: any) {
  const [_, dashboardNames] = await serverDashboardNames();

  return (
    <div className='ossl'>
      <App dashboardNames={dashboardNames}>
        {children}
      </App>
    </div>
  )
}