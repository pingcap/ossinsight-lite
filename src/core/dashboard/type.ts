import { Dashboard, ItemReference } from '@/src/types/config';
import { Disposable, ReactBindCollection } from '@/packages/ui/hooks/bind';

export interface DashboardInstance extends Disposable {
  readonly name: string;
  layout: Dashboard['layout'];

  currentItems (): ItemReference[];

  readonly items: ReactBindCollection<ItemReference>;

  syncWith (dashboard: DashboardInstance): void;
}