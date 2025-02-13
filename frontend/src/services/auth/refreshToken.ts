import axios from 'axios';
import {API_URL, ErrorResponse} from './utils';

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{accessToken: string}> => {
  try {
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await axios.post<{accessToken: string}>(
      `${API_URL}token/refresh/`,
      {refresh: refreshToken},
    );

    return response.data;
  } catch (error: any) {
    throw (error.response?.data as ErrorResponse) || error.message;
  }
};
