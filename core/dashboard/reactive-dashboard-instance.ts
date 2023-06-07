import { DashboardInstance } from '@/core/dashboard/type';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { breakpointNames } from '@/utils/layout';
import { Dashboard, ItemReference } from '@/utils/types/config';
import { GeneralEvent } from '@ossinsight-lite/ui/hooks/bind/BindBase';
import { ReactBindCollection } from '@ossinsight-lite/ui/hooks/bind/ReactBindCollection';
import { BindingTypeEvent, KeyType } from '@ossinsight-lite/ui/hooks/bind/types';
import { Layouts } from 'react-grid-layout';
import { Subscription } from 'rxjs';

export class ReactiveDashboardInstance implements DashboardInstance {
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;
  private _subscription: Subscription | undefined;

  constructor (readonly name: string, config: Dashboard) {
    this.layout = config.layout;
    const items = this.items = new ReactBindCollection<ItemReference>();
    items._key = `${name}.items`;

    config.items.forEach(item => {
      items.add(item.id, item);
    });
  }

  addDisposeDependency (subscription: Subscription | undefined) {
    if (this._subscription && !this._subscription?.closed) {
      this._subscription.add(subscription);
    } else {
      this._subscription = subscription;
    }
  }

  currentItems (): ItemReference[] {
    return this.items.values;
  }

  dispose () {
    this._subscription?.unsubscribe();
    this.items.keys.forEach(key => this.items.del(key));
  }

  computeLayout () {
    return breakpointNames.reduce((layouts, breakpoint) => {
      const layout = this.items.values.flatMap(item => {
        const layout = item.layout[breakpoint];
        if (layout) {
          return [{
            ...layout,
            i: item.id,
          }];
        } else {
          return [];
        }
      });
      if (layout.length === this.items.keys.length) {
        layouts[breakpoint] = layout;
      }
      return layouts;
    }, {} as Layouts);
  }
}

function clone ({ id, layout, zIndex }: ItemReference): ItemReference {
  return {
    id,
    layout: Object.entries(layout).reduce((res, [k, v]) => Object.assign(res, { [k]: { ...v } }), {}),
    zIndex,
  };
}

function sync (items: ReactBindCollection<ItemReference>, [{ current: item }, key, ev]: GeneralEvent<KeyType, ReactiveValue<ItemReference>>) {
  switch (ev) {
    case BindingTypeEvent.CREATED:
      if (items.has(key)) {
        items.update(key, clone(item));
      } else {
        items.add(key, clone(item));
      }
      break;
    case BindingTypeEvent.DELETED:
      if (items.has(key)) {
        items.del(key);
      }
      break;
    case BindingTypeEvent.UPDATED:
      if (items.has(key)) {
        items.update(key, clone(item));
      } else {
        items.add(key, clone(item));
      }
      break;
  }
}
