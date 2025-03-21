import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  getAllComments,
  postComment,
  deleteComment,
} from '../../services/comment/comments';

type CommentType = {
  id: number;
  user_id: number;
  image_id: number;
  comment: string;
  created_at?: string;
};

type CommentsState = {
  comments: CommentType[];
  loading: boolean;
  error: string | null;
};

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getAllComments();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching comments');
    }
  },
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (
    newComment: {image_id: number; comment: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await postComment(newComment);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error adding comment');
    }
  },
);

export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async (comment_id: number, {rejectWithValue}) => {
    try {
      await deleteComment(comment_id);
      return comment_id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error removing comment');
    }
  },
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchComments.fulfilled,
        (state, action: PayloadAction<CommentType[]>) => {
          state.loading = false;
          state.comments = action.payload;
        },
      )
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addComment.pending, state => {
        state.loading = true;
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<CommentType>) => {
          state.loading = false;
          state.comments.push(action.payload);
        },
      )
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(removeComment.pending, state => {
        state.loading = true;
      })
      .addCase(
        removeComment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.comments = state.comments.filter(
            comment => comment.id !== action.payload,
          );
        },
      )
      .addCase(removeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default commentsSlice.reducer;
