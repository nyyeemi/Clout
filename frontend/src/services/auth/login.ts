import axios from 'axios';
import {API_URL} from './utils';
import {User} from '../user/users';

type AuthResponse = {
  access: string;
  refresh: string;
  user: User;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}login/`, {
      username,
      password,
    });
    return {
      accessToken: response.data.access,
      refreshToken: response.data.refresh,
      user: response.data.user,
    };
  } catch (error: unknown) {
    throw error;
  }
};
