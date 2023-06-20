import { Warnings } from '@/components/SiteStatus/Warnings';
import { useSiteWarnings } from '@/store/features/notifications';
import './style.scss';

export function SiteStatus () {
  const warnings = useSiteWarnings();

  return (
    <div className="site-status">
      {warnings.length > 0 && <Warnings warnings={warnings} />}
    </div>
  );
}
