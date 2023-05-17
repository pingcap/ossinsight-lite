import { ReactBindCollection } from '@oss-widgets/ui/hooks/bind';
import { Dashboard, ItemReference } from '../../types/config';
import { Disposable } from '@oss-widgets/ui/hooks/bind/types';

export class DashboardInstance implements Disposable {
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;

  constructor (config: Dashboard) {
    this.layout = config.layout;
    const items = this.items = new ReactBindCollection<ItemReference>();

    config.items.forEach(item => {
      items.add(item.id, item);
    });
  }

  dispose () {
    this.items.keys.forEach(key => this.items.del(key));
  }
}
