import {apiSlice} from '../apiSlice';

import {
  CustomUser,
  FollowMutationPayload,
  Message,
  UpdatePasswordPayload,
  UpdateUserPayload,
} from '../../../types/types';

type ProfilepictureResponse = {
  profile_picture_url: string;
};

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
    updateUserMe: builder.mutation<CustomUser, UpdateUserPayload>({
      query: body => ({
        url: `users/me`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{type: 'Users'}, {type: 'Posts' as const, id: 'LIST'}],
    }),
    updatePassword: builder.mutation<Message, UpdatePasswordPayload>({
      query: body => ({
        url: `users/me/password`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteAccount: builder.mutation<Message, void>({
      query: () => ({
        url: `users/me`,
        method: 'DELETE',
      }),
    }),
    getProfilePictureByUsername: builder.query<ProfilepictureResponse, string>({
      query: username => `users/${username}/profilepicture`,
    }),
  }),
});

export const {
  useGetUsersMeQuery,
  useCreateFollowMutation,
  useDeleteFollowMutation,
  useUpdateUserMeMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
  useGetProfilePictureByUsernameQuery,
} = usersApi;
