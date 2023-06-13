import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type AuthState = {
  authenticated: boolean
  playground: boolean
}

const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth',
  }),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    reload: builder.query<AuthState, void>({
      query: () => ``,
    }),
  }),
});

export function useAuth () {
  const { data: authData, isUninitialized, isLoading, isFetching } = authApi.useReloadQuery();
  return {
    authenticated: authData?.authenticated ?? false,
    pending: isUninitialized || isLoading || isFetching,
  };
}

export default authApi;
