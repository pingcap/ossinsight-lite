import { ReactBindCollection } from '@oss-widgets/ui/hooks/bind/ReactBindCollection';
import { Dashboard, ItemReference } from '../../types/config';
import { BindingTypeEvent, Disposable, KeyType } from '@oss-widgets/ui/hooks/bind';
import { Subscription } from 'rxjs';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { GeneralEvent } from '@/packages/ui/hooks/bind';

export class DashboardInstance implements Disposable {
  layout: Dashboard['layout'];
  readonly items: ReactBindCollection<ItemReference>;
  private _subscription: Subscription | undefined;

  addDisposeDependency (subscription: Subscription | undefined) {
    if (this._subscription && !this._subscription?.closed) {
      this._subscription.add(subscription);
    } else {
      this._subscription = subscription;
    }
  }

  constructor (readonly _key: string, config: Dashboard) {
    this.layout = config.layout;
    const items = this.items = new ReactBindCollection<ItemReference>();
    items._key = `${_key}.items`;

    config.items.forEach(item => {
      items.add(item.id, item);
    });
  }

  dispose () {
    this._subscription?.unsubscribe();
    this.items.keys.forEach(key => this.items.del(key));
  }

  syncWith (source: DashboardInstance) {
    console.debug(`[layout:${this._key}] start syncing with`, source._key, source.items.values.length);
    const items = this.items;

    source.items.values.forEach((item) => {
      items.add(item.id, clone(item));
    });

    let submitting = false;
    let syncing = false;

    // Subscribe upstream changes
    this.addDisposeDependency(source.items.events.subscribe((ev) => {
      // Prevent sync when submit changes
      if (submitting) {
        return;
      }
      syncing = true;
      sync(items, ev);
      syncing = false;
    }));

    // Publish local changes
    this.addDisposeDependency(items.events.subscribe((ev) => {
      // Prevent submit when syncing upstream changes
      if (syncing) {
        return;
      }
      submitting = true;
      sync(source.items, ev);
      submitting = false;
    }));
  }
}

function clone ({ id, rect, zIndex }: ItemReference): ItemReference {
  return {
    id,
    rect: [...rect],
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
