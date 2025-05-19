import {configureStore} from '@reduxjs/toolkit';

import {apiSlice} from '../api/apiSlice';
import authReducer from '../slices/authSlice';
import feedImageReducer from '../slices/feedImageSlice';
import {mockApiSlice} from '../slices/mockApiSlice';
import voteImageReducer from '../slices/voteImageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    voteImage: voteImageReducer,
    feedImage: feedImageReducer,
    [mockApiSlice.reducerPath]: mockApiSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(mockApiSlice.middleware)
      .concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
