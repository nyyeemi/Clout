import {apiSlice} from '../apiSlice';

type CustomUser = {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string;
  num_followers: number;
  num_following: number;
  profile_picture_url: string;
  num_posts: number;
  is_followed_by_current_user?: boolean;
};

type UpdateUserPayload = {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_picture_url?: string;
};

type UpdatePasswordPayload = {
  current_password: string;
  new_password: string;
};

type Message = {
  message: string;
};

type UserPageParam = {
  skip: number;
  limit: number;
};

type User = {
  id: string;
  is_active: boolean;
  is_superuser: boolean;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string;
  profile_picture_url: string;
  num_followers: number;
  num_following: number;
  num_posts: number;
};

type UsersResponse = {
  data: User[];
  count: number;
};

export const usersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersMe: builder.query<CustomUser, void>({
      query: () => 'users/me',
      providesTags: ['Users'],
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

    getUsers: builder.infiniteQuery<UsersResponse, void, UserPageParam>({
      query: ({pageParam: {skip, limit}}) => {
        const params = new URLSearchParams();
        if (skip) params.append('skip', skip.toString());
        if (limit) params.append('limit', limit.toString());

        return `admin/users?${params.toString()}`;
      },
      infiniteQueryOptions: {
        initialPageParam: {
          limit: 6,
          skip: 0,
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          if (lastPage.count < lastPageParam.limit) {
            return undefined;
          }
          const lastPost = lastPage.data.at(-1);

          if (!lastPost) {
            console.warn(
              'No last data found on the last page, stopping pagination.',
            );
            return undefined;
          }

          return {
            limit: lastPageParam.limit,
            skip: lastPageParam.skip + lastPage.count,
          };
        },
      },
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersMeQuery,
  useUpdateUserMeMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
  useGetUsersInfiniteQuery,
} = usersApi;
