import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import cameraReducer from '../slices/cameraSlice';
import voteImageReducer from '../slices/voteImageSlice';
import feedImageReducer from '../slices/feedImageSlice';
import likeReducer from '../slices/likeSlice';
import commentReducer from '../slices/commentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    camera: cameraReducer,
    voteImage: voteImageReducer,
    feedImage: feedImageReducer,
    like: likeReducer,
    comment: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
