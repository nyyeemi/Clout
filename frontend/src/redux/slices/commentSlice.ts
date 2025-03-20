import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type CommentType = {
  id: number;
  user_id: number;
  image_id: number;
  comment: string;
  created_at: string;
};

type LikesState = {
  comments: CommentType[];
};

const initialState: LikesState = {
  comments: [],
};

export const likesSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<CommentType[]>) => {
      state.comments = action.payload;
    },
    addComment: (state, action: PayloadAction<CommentType>) => {
      state.comments.push(action.payload);
    },
    removeComment: (state, action: PayloadAction<{comment_id: number}>) => {
      state.comments = state.comments.filter(
        comment => comment.id !== action.payload.comment_id,
      );
    },
  },
});

export const {setComments, addComment, removeComment} = likesSlice.actions;
export default likesSlice.reducer;
