import { Disposable, ReactBindCollection } from '@/packages/ui/hooks/bind';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { BreakpointName } from '@/utils/layout';
import { Dashboard, ItemReference } from '@/utils/types/config';
import { Layouts } from 'react-grid-layout';

export interface DashboardInstance extends Disposable {
  readonly name: string;
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;
  readonly syncVersion: ReactiveValue<number>;

  currentItems (): ItemReference[];

  syncWith (dashboard: DashboardInstance): void;

  computeLayout (): Layouts;
}