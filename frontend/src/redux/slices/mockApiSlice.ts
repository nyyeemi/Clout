import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  mockFollowRelations,
  mockImageList,
  mockLikes,
  mockUserList,
} from '../../mock/mock';
import {CustomImage, CustomUser} from '../../types/types';

let mutableMockLikes = [...mockLikes];
let mutableMockFollowRelations = [...mockFollowRelations];

type LikeType = {
  id: number;
  user_id: number;
  image_id: number;
  created_at?: string;
};

type FollowType = {
  id: number;
  user_id1: number;
  user_id2: number;
};

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.user.id === id);
};

const getUserById = async (id: number) => {
  return mockUserList.find(user => user.id === id);
};

const getUserFollowers = async (id: number) => {
  return mutableMockFollowRelations.flatMap(data => {
    return data.user_id2 === id
      ? mockUserList.find(user => user.id === data.user_id1) || []
      : [];
  });
};

const getUserFollowing = async (id: number) => {
  return mutableMockFollowRelations.flatMap(data => {
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
  tagTypes: ['Likes', 'Following', 'Followers'],
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
    getUsersByIds: builder.query<CustomUser[], number[]>({
      queryFn: async userIds => {
        return {data: mockUserList.filter(user => userIds.includes(user.id))};
      },
    }),
    getUserFollowers: builder.query<CustomUser[], number>({
      queryFn: async (userId: number) => {
        const users = await getUserFollowers(userId);
        console.log(
          `[QueryFn] getUserFollowers for ${userId} - Reading Store:`,
          [...mutableMockFollowRelations],
        );
        return {data: users};
      },
      providesTags: (result, error, userId) => {
        console.log(
          `[Provides Tag] Followers list for ID: ${userId}`,
          typeof userId,
        );
        return [{type: 'Followers', id: userId}];
      },
    }),
    getUserFollowing: builder.query<CustomUser[], number>({
      queryFn: async (userId: number) => {
        const users = await getUserFollowing(userId);
        console.log(
          `[QueryFn] getUserFollowing for ${userId} - Reading Store:`,
          [...mutableMockFollowRelations],
        );
        return {data: users};
      },
      providesTags: (result, error, userId) => {
        console.log(
          `[Provides Tag] Following list for ID: ${userId}`,
          typeof userId,
        );
        return [{type: 'Following', id: userId}];
      },
    }),
    followUser: builder.mutation<FollowType, Omit<FollowType, 'id'>>({
      queryFn: async ({user_id1, user_id2}) => {
        const relationToAdd = {
          id: Date.now(),
          user_id1: user_id1,
          user_id2: user_id2,
        };
        mutableMockFollowRelations = mutableMockFollowRelations.concat([
          relationToAdd,
        ]);
        console.log(
          `[Mutation] followUser: Added ${user_id1} -> ${user_id2}. Store:`,
          [...mutableMockFollowRelations],
        );
        return {data: relationToAdd};
      },
      invalidatesTags: (result, error, {user_id1, user_id2}) => {
        console.log(
          `[Invalidating Tags] Following: ${user_id1}, Followers: ${user_id2}`,
        ); // Log IDs being used
        return [
          {type: 'Following', id: user_id1},
          {type: 'Followers', id: user_id2},
        ];
      },
    }),
    unFollowUser: builder.mutation<null, Omit<FollowType, 'id'>>({
      queryFn: async ({user_id1: id1, user_id2: id2}) => {
        mutableMockFollowRelations = mutableMockFollowRelations.filter(
          relation => !(relation.user_id1 === id1 && relation.user_id2 === id2),
        );
        console.log(
          `[Mutation] unFollowUser: Removed ${id1} -> ${id2}. Store:`,
          [...mutableMockFollowRelations],
        );
        return {data: null};
      },
      invalidatesTags: (result, error, {user_id1, user_id2}) => [
        {type: 'Following', id: user_id1},
        {type: 'Followers', id: user_id2},
      ],
    }),
    getLikesByImageId: builder.query<LikeType[], number>({
      queryFn: async image_id => {
        return {
          data: mutableMockLikes.filter(item => item.image_id === image_id),
        };
      },
      providesTags: (result, error, image_id) => [
        {type: 'Likes', id: image_id},
      ],
    }),
    addLike: builder.mutation<LikeType, number>({
      queryFn: async image_id => {
        const newLike = {
          id: Date.now(),
          user_id: 1,
          image_id: image_id,
          created_at: new Date().toISOString(),
        };
        mutableMockLikes = [...mutableMockLikes, newLike];
        return {data: newLike};
      },
      invalidatesTags: (result, error, image_id) => [
        {type: 'Likes', id: image_id},
      ],
    }),
    deleteLike: builder.mutation<LikeType[], LikeType>({
      queryFn: async ({id}) => {
        mutableMockLikes = mutableMockLikes.filter(like => like.id !== id);
        return {data: mutableMockLikes};
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
  useGetUsersByIdsQuery,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useGetLikesByImageIdQuery,
  useAddLikeMutation,
  useDeleteLikeMutation,
  useFollowUserMutation,
  useUnFollowUserMutation,
} = mockApiSlice;
