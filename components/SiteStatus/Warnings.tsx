import { SiteWarnings } from '@/store/common/warnings';
import * as RuiPopover from '@radix-ui/react-popover';
import WarningIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg';
import Link from 'next/link';

export function Warnings ({ warnings }: { warnings: SiteWarnings[] }) {

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
  }
}
