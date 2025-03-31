import axios from 'axios';
import {getAccessToken} from '../utils';
import {CustomImage, CustomUser} from '../../types/types';

const API_URL = 'http://localhost:8000/api/CustomUsers/';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

instance.interceptors.request.use(async config => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const getCustomCustomUsers = async (): Promise<CustomUser[]> => {
  const response = await instance.get<CustomUser[]>('/');
  return response.data;
};

export const getCustomUserById = async (id: number): Promise<CustomUser> => {
  const response = await instance.get<CustomUser>(`${id}/`);
  return response.data;
};

export const updateCustomUser = async (
  id: number,
  CustomUserData: Partial<CustomUser>,
): Promise<CustomUser> => {
  const response = await instance.put<CustomUser>(`${id}/`, CustomUserData);
  return response.data;
};

export const deleteCustomUser = async (id: number): Promise<void> => {
  await instance.delete(`${id}/`);
};

export const getImagesByCustomUser = async (
  id: number,
): Promise<CustomImage[]> => {
  const response = await instance.get<CustomImage[]>(`${id}/images/`);
  return response.data;
};
/* not implemented in backend|
------------------------------------------------------------------------------
Todo: table for storing followers relations: id: PK, CustomUser_id1: FK, CustomUser_id2: FK;

/api/
    ├── CustomUsers/
    │   ├── {id}/                  # Get, update, or delete a specific CustomUser
    │   ├── {id}/follow/           # Follow a CustomUser
    │   ├── {id}/unfollow/         # Unfollow a CustomUser
    │   ├── {id}/followers/        # Get list of followers for a CustomUser
    │   └── {id}/following/        # Get list of CustomUsers a CustomUser is following
-----------------------------------------------------------------------------
export const getCustomUserFollowers = async (id: number): Promise<CustomImage[]> => {
  const response = await instance.get<CustomImage[]>(`${id}/`);
  return response.data;
};

export const getCustomUserFollowing = async (id: number): Promise<CustomImage[]> => {
  const response = await instance.get<CustomImage[]>(`${id}/`);
  return response.data;
};
*/
