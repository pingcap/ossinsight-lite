import { getDashboard } from '@/app/(client)/api/layout/operations';
import { cache } from 'react';

export const serverDashboard = cache(getDashboard);
