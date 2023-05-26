import { Disposable, ReactBindCollection } from '@/packages/ui/hooks/bind';
import { Dashboard, ItemReference } from '@/utils/types/config';

export interface DashboardInstance extends Disposable {
  readonly name: string;
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;

  currentItems (): ItemReference[];

  syncWith (dashboard: DashboardInstance): void;
}