import axios from 'axios';

import {API_URL} from '../../redux/api/utils';

type RegisterResponse = {
  id: number;
  username: string;
  email: string;
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_URL}register/`, {
    username,
    email,
    password,
  });
  return response.data;
};
