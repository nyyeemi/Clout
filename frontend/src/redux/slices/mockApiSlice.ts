import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  mockFollowRelations,
  mockImageList,
  mockUserList,
} from '../../mock/mock';
import {CustomImage, CustomUser} from '../../types/types';

let mockLikes = [
  {
    id: 1,
    user_id: 0,
    image_id: 1,
    created_at: '2024-03-07T12:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    image_id: 1,
    created_at: '2024-03-07T12:05:00Z',
  },
  {
    id: 3,
    user_id: 3,
    image_id: 1,
    created_at: '2024-03-07T12:10:00Z',
  },
  {
    id: 4,
    user_id: 2,
    image_id: 2,
    created_at: '2024-03-07T12:15:00Z',
  },
  {
    id: 5,
    user_id: 1,
    image_id: 3,
    created_at: '2024-03-07T12:20:00Z',
  },
  {
    id: 6,
    user_id: 2,
    image_id: 1,
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 7,
    user_id: 3,
    image_id: 2,
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 8,
    user_id: 0,
    image_id: 3,
    created_at: '2024-03-07T12:25:00Z',
  },
];

/*let mockComments = [
  {
    id: 1,
    user_id: 0,
    image_id: 1,
    comment: 'HIENO KUVA',
    created_at: '2024-03-07T12:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    image_id: 1,
    comment: 'HIENO KUVA joo',
    created_at: '2024-03-07T12:05:00Z',
  },
  {
    id: 3,
    user_id: 3,
    image_id: 1,
    comment: 'HIENO KUVA hei hoi hai',
    created_at: '2024-03-07T12:10:00Z',
  },
  {
    id: 4,
    user_id: 2,
    image_id: 2,
    comment: 'HIENO KUVA',
    created_at: '2024-03-07T12:15:00Z',
  },
  {
    id: 5,
    user_id: 1,
    image_id: 3,
    comment: 'ONPA HIenooo',
    created_at: '2024-03-07T12:20:00Z',
  },
  {
    id: 6,
    user_id: 2,
    image_id: 1,
    comment: 'katos katos',
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 7,
    user_id: 3,
    image_id: 2,
    comment: 'terve mikä kuva',
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 8,
    user_id: 0,
    image_id: 1,
    comment: 'HIENO KUVA hahaha',
    created_at: '2024-03-07T12:00:00Z',
  },
];
*/

type LikeType = {
  id: number;
  user_id: number;
  image_id: number;
  created_at?: string;
};

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.user.id === id);
};

const getUserById = async (id: number) => {
  return mockUserList.find(user => user.id === id);
};

const getUserFollowers = async (id: number) => {
  return mockFollowRelations.flatMap(data => {
    return data.user_id2 === id
      ? mockUserList.find(user => user.id === data.user_id1) || []
      : [];
  });
};

const getUserFollowing = async (id: number) => {
  return mockFollowRelations.flatMap(data => {
    return data.user_id1 === id
      ? mockUserList.find(user => user.id === data.user_id2) || []
      : [];
  });
};

// mock api
export const mockApiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'mockApi',
  // Replace with our actual base url
  baseQuery: fetchBaseQuery({baseUrl: '/fakeApi'}),
  tagTypes: ['Likes'],
  endpoints: builder => ({
    getPosts: builder.query<CustomImage[], number>({
      queryFn: async (userId: number) => {
        const posts = await getImagesByUser(userId);
        return {data: posts};
      },
    }),
    getUserById: builder.query<CustomUser | undefined, number>({
      queryFn: async (userId: number) => {
        const user = await getUserById(userId);
        return {data: user};
      },
    }),
    getUserFollowers: builder.query<CustomUser[], number>({
      queryFn: async (userId: number) => {
        const users = await getUserFollowers(userId);
        return {data: users};
      },
    }),
    getUserFollowing: builder.query<CustomUser[], number>({
      queryFn: async (userId: number) => {
        const users = await getUserFollowing(userId);
        return {data: users};
      },
    }),
    getLikesByImageId: builder.query<LikeType[], number>({
      queryFn: async image_id => {
        return {data: mockLikes.filter(item => item.image_id === image_id)};
      },
      providesTags: (result, error, image_id) => [
        {type: 'Likes', id: image_id},
      ],
    }),
    addLike: builder.mutation<LikeType, number>({
      queryFn: async image_id => {
        const newLike = {
          id: Date.now(),
          user_id: 0,
          image_id: image_id,
          created_at: new Date().toISOString(),
        };
        mockLikes = [...mockLikes, newLike];
        return {data: newLike};
      },
      invalidatesTags: (result, error, image_id) => [
        {type: 'Likes', id: image_id},
      ],
    }),
    deleteLike: builder.mutation<LikeType[], LikeType>({
      queryFn: async ({id}) => {
        mockLikes = mockLikes.filter(like => like.id !== id);
        return {data: mockLikes};
      },
      invalidatesTags: (result, error, {image_id}) => [
        {type: 'Likes', id: image_id},
      ],
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetPostsQuery,
  useGetUserByIdQuery,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useGetLikesByImageIdQuery,
  useAddLikeMutation,
  useDeleteLikeMutation,
} = mockApiSlice;
