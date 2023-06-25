import CloudDownloadIcon from '@/components/icons/cloud-download.svg';
import Tooltip from '@/components/Tooltip';

export default function DownloadLayoutJson () {
  return (
    <Tooltip
      label={(
        <>
          <p>📊 Download current template for your own dashboard</p>
          <p className='text-secondary mt-2'>How to use: ⚙️-&gt; Import template </p>
        </>
      )}
    >
      <a className="site-header-item site-header-item-optional" href="/api/template.json">
        <CloudDownloadIcon />
      </a>
    </Tooltip>
  );
}