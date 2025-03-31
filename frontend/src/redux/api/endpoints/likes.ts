import {apiSlice} from '../apiSlice';

type LikeType = {
  id: number;
  user_id: number;
  image_id: number;
  created_at?: string;
};

export const likesApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getLikes: builder.query<LikeType[], number>({
      query: image_id => `images/${image_id}/likes/`,
      providesTags: (result, error, image_id) => [
        {type: 'Likes', id: image_id},
      ],
    }),
    likeImage: builder.mutation<LikeType, number>({
      query: image_id => ({
        url: `images/${image_id}/likes/`,
        method: 'POST',
        body: {image_id},
      }),
      invalidatesTags: (result, error, image_id) => [
        {type: 'Likes', id: image_id},
      ],
    }),
    unLikeImage: builder.mutation<void, LikeType>({
      query: ({id, image_id}) => ({
        url: `images/${image_id}/likes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, {image_id}) => [
        {type: 'Likes', id: image_id},
      ],
    }),
  }),
});

export const {useGetLikesQuery, useLikeImageMutation, useUnLikeImageMutation} =
  likesApi;
