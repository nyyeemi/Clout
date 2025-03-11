import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CustomImage} from '../../services/image/images';

type ImageTuple = [CustomImage, CustomImage];

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
