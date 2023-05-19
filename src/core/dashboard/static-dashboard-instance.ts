import { DashboardInstance } from '@/src/core/dashboard/type';
import { Dashboard, ItemReference } from '@/src/types/config';
import { ReactBindCollection } from '@/packages/ui/hooks/bind/ReactBindCollection';

export class StaticDashboardInstance implements DashboardInstance {
  items: ReactBindCollection<ItemReference>;

  get layout () {
    return this.config.layout;
  }

  currentItems () {
    return this.config.items;
  }

  syncWith (dashboard: DashboardInstance) {}

  constructor (public readonly name: string, private config: Dashboard) {
    this.items = new ReactBindCollection<ItemReference>();
    config.items.forEach(item => {
      this.items.add(item.id, item);
    });
  }

  dispose () {}

  addDisposeDependency () {}
}