import {apiSlice} from '../apiSlice';

import {CustomUser} from '../../../types/types';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersMe: builder.query<CustomUser, void>({
      query: () => 'users/me',
      providesTags: ['Users'],
    }),
  }),
});

export const {useGetUsersMeQuery} = usersApi;
