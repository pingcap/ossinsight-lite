import type { Store } from '@/store/store';
import { createSlice } from '@reduxjs/toolkit';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Command } from '../../core/commands';
import { nextValue, UpdateAction, UpdateContext } from '../../packages/ui/hooks/bind/utils';
import { Dashboard, ItemReference, LibraryItem } from '../../utils/types/config';

export type TranspiledDashboard = Omit<Dashboard, 'items'> & {
  items: Record<string, ItemReference>
}

export type DashboardsState = {
  dashboards: Record<string, TranspiledDashboard>
  current: string | undefined
  commands: Command[]
  recording: boolean
}

const dashboards = createSlice({
  name: 'dashboards',
  initialState: () => ({
    dashboards: {},
    current: undefined,
    commands: [],
    recording: true,
  } as DashboardsState),
  reducers: {
    load (state, { payload: { dashboards, restoreCommands = [] } }: { payload: { dashboards: Record<string, Dashboard>, restoreCommands?: Command[] } }) {
      Object.entries(dashboards).forEach(([name, { items, ...dashboard }]) => {
        state.dashboards[name] ??= {
          ...dashboard,
          items: items.reduce((res, item) => {
            res[item.id] = item;
            return res;
          }, {} as Record<string, ItemReference>),
        };
      });
      restoreCommands.forEach(command => {
        switch (command.type) {
          case 'update-dashboard-item': {
            const dashboard = state.dashboards[command.dashboard];
            if (dashboard) {
              dashboard.items[command.id] = command.payload;
            }
          }
            break;
          case 'delete-dashboard-item': {
            const dashboard = state.dashboards[command.dashboard];
            if (dashboard) {
              delete dashboard.items[command.id];
            }
          }
            break;
          default:
            break;
        }
      });
    },
    update ({ current, dashboards, commands, recording }, { payload: { id, item } }: { payload: { id: string, item: UpdateAction<ItemReference> } }) {
      if (!current) {
        console.warn(`Current dashboard not set.`);
        return;
      }
      const dashboard = dashboards[current];
      if (!dashboard) {
        console.warn(`Unknown dashboard ${current}.`);
        return;
      }
      const targetItem = dashboard.items[id];
      if (!item) {
        console.warn(`Unknown dashboard item ${current}.${id}.`);
        return;
      }
      const ctx = { changed: true } as UpdateContext<LibraryItem>;
      const nextItem = nextValue(targetItem, item, ctx);
      if (ctx.changed) {
        dashboard.items[id] = nextItem;
        if (recording) {
          commands.push({
            type: 'update-dashboard-item',
            dashboard: current,
            id,
            payload: nextItem,
          });
        }
      }
    },
    add ({ current, commands, recording, dashboards }, { payload: { item } }: { payload: { item: ItemReference | ItemReference[] } }) {
      function addInternal (item: ItemReference) {
        if (dashboard.items[item.id]) {
          console.warn(`${current}.${item.id} already exists`);
          return;
        }
        dashboard.items[item.id] = item;
        if (recording) {
          commands.push({
            type: 'update-dashboard-item',
            dashboard: current!,
            id: item.id,
            payload: item,
          });
        }
      }

      if (!current) {
        console.warn(`Current dashboard not set.`);
        return;
      }
      const dashboard = dashboards[current];
      if (!dashboard) {
        console.warn(`Unknown dashboard ${current}.`);
        return;
      }

      if (item instanceof Array) {
        item.forEach(addInternal);
      } else {
        addInternal(item);
      }
    },
    deleteLibraryItems ({ commands, recording, dashboards }, { payload: { id }}: { payload: { id: string }}) {
      Object.entries(dashboards).forEach(([name, dashboard]) => {
        if (dashboard.items[id]) {
          delete dashboard.items[id];
          if (recording) {
            commands.push({
              type: 'delete-dashboard-item',
              dashboard: name,
              id,
            })
          }
        }
      })
    },
    delete ({ current, commands, recording, dashboards }, { payload: { id } }: { payload: { id: string } }) {
      if (!current) {
        console.warn(`Current dashboard not set.`);
        return;
      }
      const dashboard = dashboards[current!];
      if (!dashboard) {
        console.warn(`Unknown dashboard ${current}.`);
        return;
      }

      if (dashboard.items[id]) {
        delete dashboard.items[id];
        if (recording) {
          commands.push({
            type: 'delete-dashboard-item',
            dashboard: current,
            id,
          });
        }
      }
    },

    enter (state, { payload: { dashboard, initial } }: { payload: { dashboard: string, initial?: Dashboard } }) {
      if (!state.dashboards[dashboard]) {
        if (initial) {
          const { items, ...rest } = initial;
          state.dashboards[dashboard] = {
            ...rest,
            items: items.reduce((res, item) => {
              res[item.id] = item;
              return res;
            }, {} as Record<string, ItemReference>),
          };
        } else {
          console.warn(`Unknown dashboard ${dashboard}`);
        }
      }
      state.current = dashboard;
    },
    exit (state) {
      if (!state.current) {
        console.warn('No current dashboard.');
      }
      state.current = undefined;
    },

    startRecording (state) {
      state.recording = true;
    },

    stopRecording (state) {
      state.recording = false;
    },

    clearCommands (state) {
      state.commands = [];
    },
  },
});

export function useSwitchCurrentDashboard (name: string, onEnter: (name: string, dashboard: TranspiledDashboard) => void) {
  const dispatch = useDispatch();
  const [current, dashboard] = useSelector<{ dashboards: DashboardsState }, [string | undefined, TranspiledDashboard | undefined]>(({ dashboards: { current, dashboards } }) => {
    return [current, get(dashboards, current)];
  }, compareCurrentDashboard);

  useEffect(() => {
    dispatch(dashboards.actions.enter({ dashboard: name }));

    return () => {
      dashboards.actions.exit();
    };
  }, [name]);

  useEffect(() => {
    if (dashboard) {
      onEnter(name, dashboard);
    }
  }, [current, dashboard !== undefined]);
}

export function useInitialLoadDashboards (store: Store, initialDashboards: Record<string, Dashboard>) {
  useEffect(() => {
    store.dispatch(dashboards.actions.load({ dashboards: initialDashboards, restoreCommands: store.getState().draft.localStorageUncommittedChanges }));
  }, []);
}

export function useAddDashboardItem () {
  const dispatch = useDispatch();

  return useCallback((item: ItemReference) => {
    dispatch(dashboards.actions.add({ item }));
  }, []);
}

export function useDeleteDashboardItem () {
  const dispatch = useDispatch();

  return useCallback((id: string) => {
    dispatch(dashboards.actions.delete({ id }));
  }, []);
}

export function useDashboardItemIds () {
  return useSelector<{ dashboards: DashboardsState }, Set<string>>(({ dashboards: { dashboards, current } }) => {
    const items = get(dashboards, current)?.items;
    if (items) {
      return new Set(Object.keys(items));
    } else {
      return new Set();
    }
  }, compareSet);
}

export function useDashboardItems () {
  const items = useSelector<{ dashboards: DashboardsState }, Record<string, ItemReference> | undefined>(({ dashboards: { dashboards, current } }) => get(dashboards, current)?.items);

  if (!items) {
    return {};
  }
  return items;
}

function get<T, K extends keyof T> (obj: T, key: K | undefined) {
  if (key === undefined) {
    return undefined;
  }
  return obj[key];
}

function compareSet<T> (a: Set<T>, b: Set<T>) {
  return a.size === b.size && [...a].every(item => b.has(item));
}

function compareCurrentDashboard (a: [string | undefined, TranspiledDashboard | undefined], b: [string | undefined, TranspiledDashboard | undefined]): boolean {
  if (a[0] !== b[0]) {
    return false;
  }
  return !(a[1] === undefined || b[1] === undefined);

}

export default dashboards;