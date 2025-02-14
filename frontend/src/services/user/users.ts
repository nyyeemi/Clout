import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/';

export type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
};

export const getUsers = async (token: string): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(API_URL, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getUserById = async (id: number, token: string): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_URL}${id}/`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateUser = async (
  id: number,
  userData: Partial<User>,
  token: string,
): Promise<User> => {
  try {
    const response = await axios.put<User>(`${API_URL}${id}/`, userData, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const deleteUser = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}${id}/`, {
      headers: {Authorization: `Bearer ${token}`},
    });
  } catch (error: unknown) {
    throw error;
  }
};
