import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
//import {CustomImage} from '../../services/image/images';
import {
  mockImageList,
  mockUserList,
  CustomImage,
  mockFollowRelations,
} from '../../screens/Feed/mock';
import {CustomUser} from '../../screens/Vote/mock';

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

// Mock API
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/fakeApi'}),
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
  }),
});

export const {
  useGetPostsQuery,
  useGetUserByIdQuery,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
} = apiSlice;
