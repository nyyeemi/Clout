import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {API_URL} from '../../services/utils';
import {RootState} from '../store/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Users',
    'Likes',
    'Comments',
    'Posts',
    'Profile',
    'Followers',
    'Following',
  ],
  endpoints: () => ({}),
});
