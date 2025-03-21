//import {AxiosResponse} from 'axios';
import {mockLikes} from '../../screens/Feed/mock';
import instance, {API_URL} from '../utils';

type LikeType = {
  id: number;
  user_id: number;
  image_id: number;
  created_at?: string;
};

/*
export const getAllLikes = async (): Promise<LikeType[]> => {
  const response = await instance.get<LikeType[]>(`${API_URL}/likes/`);
  return response.data;
};
*/

//MOCK API
export const getAllLikes = async () => {
  return mockLikes;
};

export const getLikeById = async (id: number): Promise<LikeType> => {
  const response = await instance.get<LikeType>(`${API_URL}/likes/${id}/`);
  return response.data;
};

/*
export const likeImage = async (image_id: number): Promise<LikeType> => {
  const response = await instance.post<LikeType>(`${API_URL}/likes/`, {
    image_id,
  });
  return response.data;
};
*/

//MOCK API
export const likeImage = async (image_id: number) => {
  const response = {
    id: Date.now(),
    user_id: 0,
    image_id: image_id,
    created_at: new Date().toISOString(),
  };
  return response;
};

/*
export const unLikeImage = async (like_id: number): Promise<AxiosResponse> => {
  const response = await instance.delete(`${API_URL}/likes/${like_id}`);
  return response.data;
};
*/

//MOCK API
export const unLikeImage = async (like_id: number) => {
  console.log('Unlike', like_id);
};
