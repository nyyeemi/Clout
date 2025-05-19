import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {PostType} from '../../types/types';

type ImageTuple = [PostType, PostType];

type VoteImageState = {
  activeVoteImages: ImageTuple[];
  nextVoteImages: ImageTuple[];
};

const initialState: VoteImageState = {
  activeVoteImages: [],
  nextVoteImages: [],
};

export const voteImageSlice = createSlice({
  name: 'voteImage',
  initialState,
  reducers: {
    setActiveVoteImages: (state, action: PayloadAction<ImageTuple[]>) => {
      state.activeVoteImages = action.payload;
    },
    setNextVoteImages: (state, action: PayloadAction<ImageTuple[]>) => {
      state.nextVoteImages = action.payload;
    },
    swapVoteImages: state => {
      state.activeVoteImages = state.nextVoteImages;
      state.nextVoteImages = [];
    },
  },
});

export const {setActiveVoteImages, setNextVoteImages, swapVoteImages} =
  voteImageSlice.actions;

export default voteImageSlice.reducer;
