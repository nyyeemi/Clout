import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CustomImage} from '../../types/types';

type FeedImageState = {
  feedImages: CustomImage[];
};

const initialState: FeedImageState = {
  feedImages: [],
};

export const feedImageSlice = createSlice({
  name: 'feedImages',
  initialState,
  reducers: {
    setFeedImages: (state, action: PayloadAction<CustomImage[]>) => {
      state.feedImages = [...state.feedImages, ...action.payload];
    },
  },
});

export const {setFeedImages} = feedImageSlice.actions;

export default feedImageSlice.reducer;
