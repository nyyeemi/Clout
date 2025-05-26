import type {RootState} from '../../store/store';
import {apiSlice} from '../apiSlice';

import {
  CommentDeleteRequestType,
  CommentRequestType,
  CommentType,
  CommentTypeWithCount,
  GetCommentsRequestType,
  GetLikesRequestType,
  LikeType,
  LikeTypeWithCount,
  PostRequestType,
  PostType,
  PostTypeWithCount,
  UpdateCommentRequestType,
} from '../../../types/types';

type FeedPageParam = {
  last_post_created_at?: string;
  limit: number;
};

export const postsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFeedPosts: builder.infiniteQuery<PostTypeWithCount, void, FeedPageParam>(
      {
        query: ({pageParam: {last_post_created_at, limit}}) => {
          const params = new URLSearchParams();

          if (last_post_created_at) {
            params.append('last_post_created_at', last_post_created_at);
          }

          if (limit) {
            params.append('limit', limit.toString());
          }

          const queryString = params.toString();
          return queryString ? `posts/?${queryString}` : 'posts/';
        },
        infiniteQueryOptions: {
          initialPageParam: {last_post_created_at: '', limit: 18},
          getNextPageParam: (lastPage, allPages, lastPageParam) => {
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
        providesTags: () => [{type: 'Posts'}],
      },
    ),
    createPost: builder.mutation<PostType, Partial<PostRequestType>>({
      query: body => ({
        url: 'posts/',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled, getState}) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {data} = await queryFulfilled;

          const username = (getState() as RootState).auth.username;

          dispatch(
            apiSlice.util.invalidateTags([
              {type: 'Posts'},
              {type: 'ProfilePosts', id: username},
            ]),
          );
        } catch {
          // Handle error if needed
        }
      },
    }),
    getPostById: builder.query<PostType, number>({
      query: post_id => `posts/${post_id}/`,
      providesTags: (result, error, post_id) => [{type: 'Posts', id: post_id}],
    }),
    updatePost: builder.mutation<
      PostType,
      {post_id: number} & Partial<PostRequestType>
    >({
      query: ({post_id, ...body}) => ({
        url: `posts/${post_id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, {post_id}) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    deletePost: builder.mutation<string, number>({
      query: post_id => ({
        url: `posts/${post_id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, post_id) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    getPostComments: builder.query<
      CommentTypeWithCount,
      GetCommentsRequestType
    >({
      query: ({post_id, last_comment_created_at, created_at}) => {
        const params = new URLSearchParams();

        if (last_comment_created_at) {
          params.append('last_comment_created_at', last_comment_created_at);
        }

        if (created_at) {
          params.append('order_by', created_at);
        }

        const queryString = params.toString();
        return queryString
          ? `posts/${post_id}/comments?${queryString}`
          : `posts/${post_id}/comments`;
      },
      providesTags: (result, error, {post_id}) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    createComment: builder.mutation<CommentType, CommentRequestType>({
      query: ({post_id, content}) => ({
        url: `posts/${post_id}/comments`,
        method: 'POST',
        body: {content},
      }),
      invalidatesTags: (result, error, {post_id}) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    updateComment: builder.mutation<CommentType, UpdateCommentRequestType>({
      query: ({post_id, content, comment_id}) => ({
        url: `posts/${post_id}/comments/${comment_id}`,
        method: 'PATCH',
        body: {content},
      }),
      invalidatesTags: (result, error, {post_id}) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    deleteComment: builder.mutation<string, CommentDeleteRequestType>({
      query: ({post_id, comment_id}) => ({
        url: `posts/${post_id}/comments/${comment_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, {post_id}) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    getLikes: builder.query<LikeTypeWithCount, GetLikesRequestType>({
      query: ({post_id, last_like_created_at}) => {
        const params = new URLSearchParams();

        if (last_like_created_at) {
          params.append('last_like_created_at', last_like_created_at);
        }

        const queryString = params.toString();
        return queryString
          ? `posts/${post_id}/likes?${queryString}`
          : `posts/${post_id}/likes`;
      },
      providesTags: (result, error, {post_id}) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    addLike: builder.mutation<LikeType, string>({
      query: post_id => ({
        url: `posts/${post_id}/likes`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, post_id) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    deleteLike: builder.mutation<string, string>({
      query: post_id => ({
        url: `posts/${post_id}/likes/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, post_id) => [
        {type: 'Posts', id: post_id},
      ],
    }),
  }),
});

export const {
  useGetFeedPostsInfiniteQuery,
  useCreatePostMutation,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetLikesQuery,
  useAddLikeMutation,
  useDeleteLikeMutation,
} = postsApi;
