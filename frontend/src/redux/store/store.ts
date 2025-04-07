import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import voteImageReducer from '../slices/voteImageSlice';
import feedImageReducer from '../slices/feedImageSlice';
import {mockApiSlice} from '../slices/mockApiSlice';
import {apiSlice} from '../api/apiSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    voteImage: voteImageReducer,
    feedImage: feedImageReducer,
    [mockApiSlice.reducerPath]: mockApiSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mockApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
