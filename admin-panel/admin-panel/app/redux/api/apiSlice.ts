import {createApi} from '@reduxjs/toolkit/query/react';

import {baseQueryWithReauth} from './config';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Users',
    'Likes',
    'Comments',
    'Posts',
    'Profile',
    'Followers',
    'Following',
    'ProfilePosts',
  ],
  endpoints: () => ({}),
});
