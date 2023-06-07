import { Disposable, ReactBindCollection } from '@/packages/ui/hooks/bind';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { Dashboard, ItemReference } from '@/utils/types/config';

export interface DashboardInstance extends Disposable {
  readonly name: string;
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;
  readonly syncVersion: ReactiveValue<number>;

  currentItems (): ItemReference[];

  syncWith (dashboard: DashboardInstance): void;
}