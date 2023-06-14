import CloudDownloadIcon from '@/components/icons/cloud-download.svg';
import { AddWidget } from '@/components/SiteHeader/AddWidget';
import { SQLEditorButton } from '@/components/SiteHeader/SQLEditorButton';

export function DashboardMenuItems () {
  return (
    <>
      <AddWidget />
      <a className="site-header-item" href="/api/layout.json" download="layout.json">
        <CloudDownloadIcon />
        <span>layout.json</span>
      </a>
    </>
  );
}