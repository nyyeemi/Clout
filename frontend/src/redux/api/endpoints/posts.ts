import {apiSlice} from '../apiSlice';

import {
  CommentDeleteRequestType,
  CommentRequestType,
  CommentType,
  CommentTypeWithCount,
  GetCommentsRequestType,
  GetLikesRequestType,
  GetPostRequestType,
  LikeType,
  LikeTypeWithCount,
  PostRequestType,
  PostType,
  PostTypeWithCount,
} from '../../../types/types';

export const postsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFeedPosts: builder.query<PostTypeWithCount, GetPostRequestType>({
      query: ({last_post_created_at}) => {
        const params = new URLSearchParams();

        if (last_post_created_at) {
          params.append('last_post_created_at', last_post_created_at);
        }

        const queryString = params.toString();
        return queryString ? `posts/?${queryString}` : 'posts/';
      },
      providesTags: () => [{type: 'Posts'}],
    }),
    createPost: builder.mutation<PostType, PostRequestType>({
      query: ({image_url, thumbnail_url, caption, is_visible}) => ({
        url: 'posts/',
        method: 'POST',
        body: {image_url, thumbnail_url, caption, is_visible},
      }),
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
    addLike: builder.mutation<LikeType, number>({
      query: post_id => ({
        url: `posts/${post_id}/likes`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, post_id) => [
        {type: 'Posts', id: post_id},
      ],
    }),
    deleteLike: builder.mutation<string, number>({
      query: post_id => ({
        url: `posts/${post_id}/comments/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, post_id) => [
        {type: 'Posts', id: post_id},
      ],
    }),
  }),
});

export const {
  useGetFeedPostsQuery,
  useCreatePostMutation,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetLikesQuery,
  useAddLikeMutation,
  useDeleteLikeMutation,
} = postsApi;
