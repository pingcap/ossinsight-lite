import { create } from 'zustand';

export interface EventsTotalState {
  subscribers: number;

  events: number;
  incrementEvents: number;
  ts?: number;

  // prevent decrease
  totalEvents: number;

  reloadTotalHandle?: ReturnType<typeof setInterval>;
  reloadIncrementHandle?: ReturnType<typeof setInterval>;

  controller?: AbortController;

  subscribe (): void;

  unsubscribe (): void;

  // private
  run (): void;

  abort (): void;
}

const API_BASE = `/api/ossinsight`;

export const useEventsTotal = create<EventsTotalState>((set, get) => ({
  subscribers: 0,
  events: 0,
  incrementEvents: 0,
  totalEvents: 0,

  subscribe () {
    const state = get();
    if (state.subscribers === 0) {
      state.run();
    }
    set({
      subscribers: state.subscribers + 1,
    });
  },
  unsubscribe () {
    const state = get();
    if (state.subscribers === 1) {
      state.abort();
    }
    set({
      subscribers: state.subscribers - 1,
    });
  },

  run () {
    const controller = new AbortController();

    async function fetchTotal () {
      try {
        const res = await fetch(`${API_BASE}/q/events-total`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          console.error(res.status, res.statusText, res);
          return;
        }
        const { data: [{ cnt, latest_timestamp }] } = await res.json();

        set({
          events: cnt,
          incrementEvents: 0,
          ts: latest_timestamp,
        });
      } catch (e) {
        if (e?.name !== 'AbortError') {
          console.error(e);
        }
      }
    }

    async function fetchIncrements () {
      const state = get();
      if (!state.ts) {
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/q/events-increment?ts=${state.ts}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          console.error(res.status, res.statusText, res);
          return;
        }
        const { data: [{ cnt, latest_timestamp }] } = await res.json();

        set(prev => ({
          incrementEvents: prev.incrementEvents + cnt,
          ts: latest_timestamp,
        }));
      } catch (e) {
        if (e?.name !== 'AbortError') {
          console.error(e);
        }
      }
    }

    void fetchTotal();

    set({
      controller,
      reloadTotalHandle: setInterval(fetchTotal, 60000),
      reloadIncrementHandle: setInterval(fetchIncrements, 5000),
    });
  },
  abort () {
    const state = get();
    state.controller?.abort();
    clearInterval(state.reloadIncrementHandle);
    clearInterval(state.reloadTotalHandle);
  },
}));

useEventsTotal.subscribe((state, prevState) => {
  if (state.events + state.incrementEvents > prevState.totalEvents) {
    useEventsTotal.setState({
      totalEvents: state.events + state.incrementEvents,
    });
  }
});
