import CloudDownloadIcon from '@/components/icons/cloud-download.svg';

export default function DownloadLayoutJson () {
  return (
    <a className="site-header-item" href="/api/layout.json" download="layout.json">
      <CloudDownloadIcon />
    </a>
  );
}