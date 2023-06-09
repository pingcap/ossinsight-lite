import ShareIcon from '@/components/icons/share.svg';
import { MenuItem } from '@/packages/ui/components/menu';
import { ToolbarMenu } from '@/packages/ui/components/toolbar-menu';
import { useLibraryItemField } from '@/store/features/library';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface EditLayerProps {
  id: string;
}

export default function ExploreLayer ({ id }: EditLayerProps) {
  const router = useRouter();
  const visibility = useLibraryItemField(id, item => item.visibility);

  const isPublic = visibility === 'public';

  const share = useCallback(() => {
    router.push(`/widgets/${encodeURIComponent(id)}`);
  }, [id]);

  return (
    <div
      className={clsx('absolute left-0 top-0 w-full h-full z-10 bg-gray-700 bg-opacity-0 text-white flex flex-col transition-colors pointer-events-none')}
    >
      <div className="text-black bg-black bg-opacity-0 opacity-20 hover:bg-opacity-30 hover:opacity-100 hover:text-white transition-all pointer-events-auto">
        <ToolbarMenu
          className="flex justify-end items-center"
          data-layer-item
          items={isPublic && (
            <>
              <MenuItem
                id="styles"
                text={<ShareIcon />}
                action={share}
                order={99}
              />
            </>
          )}
        >
        </ToolbarMenu>
      </div>
    </div>
  );
}