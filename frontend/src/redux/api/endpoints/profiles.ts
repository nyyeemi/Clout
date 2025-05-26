import {apiSlice} from '../apiSlice';

import {
  GetProfilePostRequestType,
  PostTypeWithCount,
  ProfileFollowersType,
  ProfileType,
} from '../../../types/types';

type ProfilePostsInitialPageParam = {
  last_post_created_at?: string;
  limit: number;
};

export const profileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfileByUserName: builder.query<ProfileType, string>({
      query: username => `profiles/${username}`,
      providesTags: (result, error, username) => [
        {type: 'Profile', id: username},
      ],
    }),
    getProfilePosts: builder.infiniteQuery<
      PostTypeWithCount,
      string,
      ProfilePostsInitialPageParam
    >({
      query: ({
        pageParam: {last_post_created_at, limit},
        queryArg: username,
      }) => {
        const params = new URLSearchParams();

        if (last_post_created_at) {
          params.append('last_post_created_at', last_post_created_at);
        }

        if (limit) {
          params.append('limit', limit.toString());
        }

        const queryString = params.toString();
        return queryString
          ? `profiles/${username}/posts?${queryString}`
          : `profiles/${username}/posts`;
      },
      infiniteQueryOptions: {
        initialPageParam: {last_post_created_at: '', limit: 18},
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          //allPageParam,
          //queryArg: string,
        ) => {
          if (lastPage.count < lastPageParam.limit) {
            return undefined;
          }
          const lastPost = lastPage.data.at(-1);

          if (!lastPost) {
            console.warn(
              'No last post found on the last page, stopping pagination.',
            );
            return undefined;
          }

          return {
            last_post_created_at: lastPost.created_at,
            limit: lastPageParam.limit,
          };
        },
      },
      providesTags: (result, error, username) => [
        {type: 'ProfilePosts', id: username},
      ],
    }),

    getProfilePostsByUserName: builder.query<
      PostTypeWithCount,
      GetProfilePostRequestType
    >({
      query: ({last_post_created_at, limit, username}) => {
        const params = new URLSearchParams();

        if (last_post_created_at) {
          params.append('last_post_created_at', last_post_created_at);
        }

        if (limit) {
          params.append('limit', limit.toString());
        }

        const queryString = params.toString();
        return queryString
          ? `profiles/${username}/posts?${queryString}`
          : `profiles/${username}/posts`;
      },
      providesTags: (result, error, {username}) => [
        {type: 'ProfilePosts', id: username},
      ],
    }),
    getProfileFollowers: builder.query<ProfileFollowersType, string>({
      query: username => `profiles/${username}/followers`,
      providesTags: (result, error, username) => [
        {type: 'Followers', id: username},
      ],
    }),
    getProfileFollowing: builder.query<ProfileFollowersType, string>({
      query: username => `profiles/${username}/following`,
      providesTags: (result, error, username) => [
        {type: 'Following', id: username},
      ],
    }),
  }),
});

export const {
  useGetProfileByUserNameQuery,
  useGetProfilePostsByUserNameQuery,
  useGetProfileFollowersQuery,
  useGetProfileFollowingQuery,
  useGetProfilePostsInfiniteQuery,
} = profileApi;
