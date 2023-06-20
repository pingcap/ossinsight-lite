'use client';
import { togglePublicDataAccess } from '@/actions/site';
import LoadingIndicator from '@/packages/ui/components/loading-indicator';
import { useServerAction } from '@/utils/server/action';
import WarningIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg';
import { useCallback } from 'react';

export function PublicDataAccessControl ({ enabled }: { enabled: boolean }) {
  const { action, error, running } = useServerAction(togglePublicDataAccess);

  const handleClick = useCallback(() => {
    action();
  }, []);

  return (
    <section>
      <div className="text-yellow-700 bg-yellow-50 rounded p-4 mb-2 border border-yellow-400">
        <h6 className="flex mb-2 items-center text-lg font-bold">
          <WarningIcon width={24} height={24} className="inline mr-4" />
          Attention
        </h6>
        <p>
          Enable this feature will allow visitors using SQL to query your GitHub data (includes private data if you used authorized GITHUB_ACCESS_TOKEN to fetch data).
        </p>
      </div>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          disabled={running}
          onChange={handleClick}
        />
        <span className="ml-2">
          Enable public data access
        </span>
        {running && <LoadingIndicator className="ml-2" />}
      </label>
    </section>
  );
}
