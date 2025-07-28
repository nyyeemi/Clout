import { apiSlice } from "../apiSlice";

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

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersMe: builder.query<CustomUser, void>({
      query: () => "users/me",
      providesTags: ["Users"],
    }),
    updateUserMe: builder.mutation<CustomUser, UpdateUserPayload>({
      query: (body) => ({
        url: `users/me`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Users" },
        { type: "Posts" as const, id: "LIST" },
      ],
    }),
    updatePassword: builder.mutation<Message, UpdatePasswordPayload>({
      query: (body) => ({
        url: `users/me/password`,
        method: "PATCH",
        body,
      }),
    }),
    deleteAccount: builder.mutation<Message, void>({
      query: () => ({
        url: `users/me`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersMeQuery,
  useUpdateUserMeMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} = usersApi;
