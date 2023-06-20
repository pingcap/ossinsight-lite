import { authenticatedWarnings, SiteWarnings } from '@/store/common/warnings';
import authApi from '@/store/features/auth';
import * as RuiPopover from '@radix-ui/react-popover';
import WarningIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg';
import Link from 'next/link';
import { useMemo } from 'react';

export function Warnings ({ warnings }: { warnings: SiteWarnings[] }) {
  warnings = useFilteredWarnings(warnings);

  return (
    <RuiPopover.Root>
      <RuiPopover.Trigger asChild>
        <button className="flex items-center gap-1 text-xs text-yellow-400 pointer-events-auto">
          <WarningIcon width={12} height={12} />
          <span className="font-bold">
            {warnings.length} {`Warning${warnings.length > 1 ? 's' : ''}`}
          </span>
        </button>
      </RuiPopover.Trigger>
      <RuiPopover.Portal>
        <RuiPopover.Content asChild className="status-popper-content" align="start">
          <ul>
            {warnings.map(warning => (
              <WarningItem warning={warning} key={warning} />
            ))}
          </ul>
        </RuiPopover.Content>
      </RuiPopover.Portal>
    </RuiPopover.Root>
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

function WarningItem ({ warning }: { warning: SiteWarnings }) {
  return (
    <li>
      {getContent(warning)}
    </li>
  );
}

function getContent (warning: SiteWarnings) {
  switch (warning) {
    case SiteWarnings.NEED_RESET_PASSWORD:
      return (
        <p>
          <strong>Security: </strong>
          <Link href="/admin/account">Reset password</Link> to protect your site.
        </p>
      );
    case SiteWarnings.NEED_RESET_JWT_SECRET:
      return (
        <p>
          <strong>Security: </strong>
          Change your <code>JWT_SECRET</code> environment variable on vercel to secure your site.
          <br />
          See <a href="https://github.com/pingcap/ossinsight-lite/blob/main/docs/setup/secure-your-site.md" target="_blank">Secure your site</a> for more details.
        </p>
      );
  }
}
