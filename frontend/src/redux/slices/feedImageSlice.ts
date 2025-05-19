import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {PostType} from '../../types/types';

type FeedImageState = {
  feedImages: PostType[];
};

const initialState: FeedImageState = {
  feedImages: [],
};

export const feedImageSlice = createSlice({
  name: 'feedImages',
  initialState,
  reducers: {
    setFeedImages: (state, action: PayloadAction<PostType[]>) => {
      state.feedImages = [...state.feedImages, ...action.payload];
    },
  },
});

export const {setFeedImages} = feedImageSlice.actions;

export default feedImageSlice.reducer;
