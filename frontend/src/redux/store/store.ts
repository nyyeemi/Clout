import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import cameraReducer from '../slices/cameraSlice';
import voteImageReducer from '../slices/voteImageSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    camera: cameraReducer,
    voteImage: voteImageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
