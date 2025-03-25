import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
//import {CustomImage} from '../../services/image/images';
import {
  mockImageList,
  mockUserList,
  CustomImage,
} from '../../screens/Feed/mock';
import {CustomUser} from '../../screens/Vote/mock';

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.user.id === id);
};

const getUserById = async (id: number) => {
  return mockUserList.find(user => user.id === id);
};

// mock api
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // Replace with our actual base url
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
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {useGetPostsQuery, useGetUserByIdQuery} = apiSlice;
