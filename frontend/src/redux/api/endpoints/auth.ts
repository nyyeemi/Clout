import {setCredentials, setUsername} from '../../slices/authSlice';
import {apiSlice} from '../apiSlice';
import {usersApi} from './users';

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  refresh_token: string;
};

type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  id: string;
  username: string;
  email: string;
};

type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login/access-token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }).toString(),
      }),
      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.access_token, // match FastAPI's return
              refreshToken: data.refresh_token,
            }),
          );

          const result = await dispatch(
            usersApi.endpoints.getUsersMe.initiate(),
          );

          if ('data' in result && result.data?.username) {
            dispatch(setUsername(result.data.username));
          }
        } catch (err) {
          console.error('Login failed', err);
        }
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: newUser => ({
        url: '/auth/signup',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      }),
    }),
    refresh: builder.mutation<RefreshResponse, {refresh_token: string}>({
      query: ({refresh_token}) => ({
        url: '/auth/refresh',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {refresh_token},
      }),
    }),
  }),
});

export const {useLoginMutation, useRegisterMutation, useRefreshMutation} =
  authApi;
