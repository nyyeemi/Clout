import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getAllLikes, likeImage, unLikeImage} from '../../services/like/likes';

type LikeType = {
  id: number;
  user_id: number;
  image_id: number;
  created_at?: string;
};

type LikesState = {
  likes: LikeType[];
  loading: boolean;
  error: string | null;
};

const initialState: LikesState = {
  likes: [],
  loading: false,
  error: null,
};

export const fetchLikes = createAsyncThunk(
  'likes/fetchLikes',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getAllLikes();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching likes');
    }
  },
);

export const addLike = createAsyncThunk(
  'likes/addLike',
  async (image_id: number, {rejectWithValue}) => {
    try {
      const response = await likeImage(image_id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error adding like');
    }
  },
);

export const removeLike = createAsyncThunk(
  'likes/removeLike',
  async (like_id: number, {rejectWithValue}) => {
    try {
      await unLikeImage(like_id);
      return like_id; // Palautetaan poistettu ID, jotta se voidaan suodattaa tilasta
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error removing like');
    }
  },
);

export const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLikes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLikes.fulfilled,
        (state, action: PayloadAction<LikeType[]>) => {
          state.loading = false;
          state.likes = action.payload;
        },
      )
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addLike.pending, state => {
        state.loading = true;
      })
      .addCase(addLike.fulfilled, (state, action: PayloadAction<LikeType>) => {
        state.loading = false;
        state.likes = [...state.likes, action.payload];
      })
      .addCase(addLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(removeLike.pending, state => {
        state.loading = true;
      })
      .addCase(removeLike.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.likes = state.likes.filter(like => like.id !== action.payload);
      })
      .addCase(removeLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default likesSlice.reducer;
