import { MenuItem } from '@/packages/ui/components/menu';
import { ToolbarMenu } from '@/packages/ui/components/toolbar-menu';
import { useLibraryItemField } from '@/store/features/library';
import { useWidget } from '@/store/features/widgets';
import BoxArrowUpRightIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface EditLayerProps {
  id: string;
}

export default function ExploreLayer ({ id }: EditLayerProps) {
  const router = useRouter();
  const visibility = useLibraryItemField(id, item => item.visibility);
  const name = useLibraryItemField(id, item => item.name)

  const isPublic = visibility === 'public';

  const { shareable } = useWidget(name)

  const share = useCallback(() => {
    router.push(`/widgets/${encodeURIComponent(id)}`);
  }, [id]);

  return (
    <div className="widget-layer">
      <div className="widget-toolbar-container">
        <ToolbarMenu
          className="widget-toolbar"
          data-layer-item
          items={isPublic && (
            <>
              {shareable && <MenuItem
                id="styles"
                text={<BoxArrowUpRightIcon />}
                action={share}
                order={99}
              />}
            </>
          )}
        >
        </ToolbarMenu>
      </div>
    </div>
  );
}