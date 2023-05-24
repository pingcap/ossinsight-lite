'use client';

import { dashboards, library } from '@/app/bind';
import { Rect } from '@ossinsight-lite/layout/src/core/types';
import type { LayoutItem } from '../../types/config';

export type { LayoutItem } from '../../types/config';

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}

export function duplicateItem (dashboardName: string, id: string, rect: (rect: Rect) => Rect, props?: (props: any) => any) {
  const dashboard = dashboards.getNullable(dashboardName)?.current.items;
  if (!dashboard) {
    return;
  }
  const subject = library.getNullable(id);
  const position = dashboard.getNullable(id);
  if (subject && position) {
    const prev = subject.current;
    const prevRect: Rect = [...position.current.rect];
    const prevProps = cloneJson(prev.props);
    const newItem = {
      id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
      name: prev.name,
      props: cloneJson(props?.(prevProps) ?? prevProps),
    };
    const newPosition = {
      id: newItem.id,
      rect: [...(rect?.(prevRect) ?? prevRect)] as Rect,
    };
    library.add(newItem.id, newItem);
    dashboard.add(newItem.id, newPosition);
  }
}
