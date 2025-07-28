import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { apiSlice } from "../api/apiSlice";
import type { AppDispatch } from "../store/store";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  username: string;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  username: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        username?: string; // Optional
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
      if (action.payload.username) {
        state.username = action.payload.username;
      }
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
      state.username = "";
    },
  },
});

export const logoutAndReset = () => (dispatch: AppDispatch) => {
  dispatch(logout());
  dispatch(apiSlice.util.resetApiState());
};

export const { setCredentials, setUsername, logout } = authSlice.actions;
export default authSlice.reducer;
