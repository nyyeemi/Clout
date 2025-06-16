import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {PostType} from '../../types/types';

type SelectedPostState = {
  selectedPost: PostType | null;
};

const initialState: SelectedPostState = {
  selectedPost: null,
};

const selectedPostSlice = createSlice({
  name: 'selectedPost',
  initialState,
  reducers: {
    setSelectedPost(state, action: PayloadAction<PostType | null>) {
      state.selectedPost = action.payload;
    },
  },
});

export const {setSelectedPost} = selectedPostSlice.actions;
export default selectedPostSlice.reducer;
