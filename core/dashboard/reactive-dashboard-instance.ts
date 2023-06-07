import { DashboardInstance } from '@/core/dashboard/type';
import { ReactiveValue, ReactiveValueSubject } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { BreakpointName, breakpointNames, getFirstBreakpointValue } from '@/utils/layout';
import { Dashboard, ItemReference } from '@/utils/types/config';
import { GeneralEvent } from '@ossinsight-lite/ui/hooks/bind/BindBase';
import { ReactBindCollection } from '@ossinsight-lite/ui/hooks/bind/ReactBindCollection';
import { BindingTypeEvent, KeyType } from '@ossinsight-lite/ui/hooks/bind/types';
import { Layouts } from 'react-grid-layout';
import { Subscription } from 'rxjs';

export class ReactiveDashboardInstance implements DashboardInstance {
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;
  readonly syncVersion: ReactiveValue<number>;
  private _subscription: Subscription | undefined;
  private _syncSubscriptions: Subscription | undefined;
  private _syncTarget: DashboardInstance | undefined;

  constructor (readonly name: string, config: Dashboard) {
    this.layout = config.layout;
    const items = this.items = new ReactBindCollection<ItemReference>();
    this.syncVersion = new ReactiveValueSubject(0);
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

  addSyncDisposeDependency (subscription: Subscription | undefined) {
    if (this._syncSubscriptions && !this._syncSubscriptions?.closed) {
      this._syncSubscriptions.add(subscription);
    } else {
      this._syncSubscriptions = subscription;
    }
  }

  currentItems (): ItemReference[] {
    return this.items.values;
  }

  dispose () {
    this._subscription?.unsubscribe();
    this._syncSubscriptions?.unsubscribe();
    this._syncTarget = undefined;
    this.items.keys.forEach(key => this.items.del(key));
  }

  syncWith (source: DashboardInstance) {
    if (source === this._syncTarget) {
      return;
    }
    this._syncTarget = source;
    console.debug(`[layout:${this.name}] switch to`, source.name, source.items.values.length);
    const items = this.items;

    this._syncSubscriptions?.unsubscribe();

    Array.from(items.keys).forEach(key => {
      if (!source.items.has(key)) {
        items.del(key);
      }
    });

    Array.from(source.items.values).forEach((item) => {
      if (items.has(item.id)) {
        items.update(item.id, clone(item));
      } else {
        items.add(item.id, clone(item));
      }
    });

    // Subscribe upstream changes
    this.addSyncDisposeDependency(source.items.events.subscribe((ev) => {
      // Prevent sync when submit changes
      source.items.inactiveScope(() => {
        sync(items, ev);
      });
    }));

    // Publish local changes
    this.addSyncDisposeDependency(items.events.subscribe((ev) => {
      // Prevent submit when syncing upstream changes
      items.inactiveScope(() => {
        sync(source.items, ev);
      });
    }));

    this.addSyncDisposeDependency(new Subscription(() => {
      console.debug(`[layout:${this.name}] exit`, source.name);
    }));

    this.syncVersion.update(this.syncVersion.current + 1);
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
