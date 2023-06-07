import CloudDownloadIcon from '@/components/icons/cloud-download.svg';
import CommonBottomMenu from '@/components/menu/CommonBottomMenu';
import { MenuItem } from '@/packages/ui/components/menu';

export default function () {
  return (
    <CommonBottomMenu>
      <MenuItem id="DownloadLayoutJSON" order={100} custom>
        <a href="/api/layout.json" download="layout.json">
          <CloudDownloadIcon />
        </a>
      </MenuItem>
    </CommonBottomMenu>
  );
}