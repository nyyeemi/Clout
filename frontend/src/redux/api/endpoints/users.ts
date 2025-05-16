import {apiSlice} from '../apiSlice';

import {CustomUser, FollowMutationPayload, Message} from '../../../types/types';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersMe: builder.query<CustomUser, void>({
      query: () => 'users/me',
      providesTags: ['Users'],
    }),
    createFollow: builder.mutation<Message, FollowMutationPayload>({
      query: ({user_id}) => ({
        url: `users/${user_id}/followers`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, {username}) => [
        {type: 'Followers', id: username},
        {type: 'Following', id: username},
        {type: 'Profile', id: username},
      ],
    }),
    deleteFollow: builder.mutation<Message, FollowMutationPayload>({
      query: ({user_id}) => ({
        url: `users/${user_id}/followers`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, {username}) => [
        {type: 'Following', id: username},
        {type: 'Followers', id: username},
        {type: 'Profile', id: username},
      ],
    }),
  }),
});

export const {
  useGetUsersMeQuery,
  useCreateFollowMutation,
  useDeleteFollowMutation,
} = usersApi;
