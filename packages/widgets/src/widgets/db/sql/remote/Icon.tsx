'use client';

import TiDBCloudIcon from '../tidbcloud.svg';
import LinkIcon from './link.svg';

export default function Icon () {
  return (
    <span className="flex gap-1 items-center">
      <LinkIcon width={14} height={14} className="text-blue-600" />
      <TiDBCloudIcon width={14} height={14} />
    </span>
  );
}
