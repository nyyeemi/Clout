import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import { logout, setCredentials } from "../slices/authSlice";
import type { RootState } from "../store/store";
import { apiSlice } from "./apiSlice";
import { API_URL } from "./utils";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(logout());
      api.dispatch(apiSlice.util.resetApiState());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.error) {
      api.dispatch(logout());
      api.dispatch(apiSlice.util.resetApiState());
      return result;
    }

    if (refreshResult.data) {
      const { access_token, refresh_token } = refreshResult.data as {
        access_token: string;
        refresh_token: string;
      };

      api.dispatch(
        setCredentials({
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      );

      // retry original request
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
