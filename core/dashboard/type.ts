import { Disposable, ReactBindCollection } from '@/packages/ui/hooks/bind';
import { Dashboard, ItemReference } from '@/utils/types/config';
import { Layouts } from 'react-grid-layout';

export interface DashboardInstance extends Disposable {
  readonly name: string;
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;

  currentItems (): ItemReference[];

  computeLayout (): Layouts;
}