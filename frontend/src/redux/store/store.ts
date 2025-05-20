import {configureStore} from '@reduxjs/toolkit';

import {apiSlice} from '../api/apiSlice';
import authReducer from '../slices/authSlice';
import notificationsReducer from '../slices/notificationsSlice';
import voteImageReducer from '../slices/voteImageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    voteImage: voteImageReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
