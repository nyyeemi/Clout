import {apiSlice} from '../apiSlice';

import {ProfilePostsType, ProfileType} from '../../../types/types';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfileByUserName: builder.query<ProfileType, string>({
      query: username => `profiles/${username}`,
      providesTags: (result, error, username) => [
        {type: 'Profile', id: username},
      ],
    }),
    getProfilePostsByUserName: builder.query<ProfilePostsType, string>({
      query: username => `profiles/${username}/posts`,
      /*providesTags: (result, error, username) => [
        {type: 'ProfilePosts', id: username},
      ],*/
    }),
    getProfileFollowers: builder.query<ProfilePostsType, string>({
      query: username => `profiles/${username}/followers`,
      /*providesTags: (result, error, username) => [
        {type: 'ProfilePosts', id: username},
      ],*/
    }),
    getProfileFollowing: builder.query<ProfilePostsType, string>({
      query: username => `profiles/${username}/following`,
      /*providesTags: (result, error, username) => [
        {type: 'ProfilePosts', id: username},
      ],*/
    }),
  }),
});

export const {useGetProfileByUserNameQuery, useGetProfilePostsByUserNameQuery} =
  profileApi;
