import { create } from 'zustand';
import { Octokit } from '@octokit/rest';
import { components } from '@octokit/openapi-types';
import cu from '../../oh-my-github/curr_user.sql?unique';

const octokit = new Octokit();

export interface RecentEventsState {
  events: components['schemas']['event'][];

  reload (signal: AbortSignal): Promise<void>;
}

export const useRecentEvents = create<RecentEventsState>((set, get) => ({
  events: [],
  async reload (signal) {
    const events = await octokit.activity.listPublicEventsForUser({
      username: cu.login,
      request: {
        signal,
      },
      per_page: 5,
    });
    set({ events: events.data });
  },
}));
