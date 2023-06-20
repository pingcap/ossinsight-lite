'use client';
import { Warnings } from '@/components/SiteStatus/Warnings';
import { authenticatedWarnings, SiteWarnings } from '@/store/common/warnings';
import authApi from '@/store/features/auth';
import { useSiteWarnings } from '@/store/features/notifications';
import { useMemo } from 'react';
import './style.scss';

export function SiteStatus () {
  const warnings = useFilteredWarnings(useSiteWarnings());

  return (
    <div className="site-status">
      {warnings.length > 0 && <Warnings warnings={warnings} />}
    </div>
  );
}

function useFilteredWarnings (warnings: SiteWarnings[]) {
  const { data } = authApi.useReloadQuery();

  return useMemo(() => {
    if (!data?.authenticated) {
      return warnings.filter(warning => !authenticatedWarnings.has(warning));
    } else {
      return warnings;
    }
  }, [warnings, data?.authenticated ?? false]);
}
