import {Platform} from 'react-native';

import axios, {AxiosResponse} from 'axios';

import {HOST} from '../../../localVariables';
import {getAccessToken} from '../utils';

import {PostType} from '../../types/types';

export const API_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:8000/api/images/'
    : `http://${HOST}:8000/api/images/`;

type ImageUpdateObject = {
  caption: string | null;
};

const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});
// more on axios interceptors: https://medium.com/@barisberkemalkoc/axios-interceptor-intelligent-db46653b7303
instance.interceptors.request.use(async config => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const getAll = async (): Promise<PostType[]> => {
  const response = await instance.get<PostType[]>(API_URL);
  return response.data;
};

const getById = async (id: number): Promise<PostType> => {
  const response = await instance.get<PostType>(`${API_URL}${id}/`);
  return response.data;
};

const create = async (image_url: string): Promise<PostType> => {
  const response = await instance.post<PostType>(API_URL, {image_url});
  return response.data;
};

const deleteImage = async (id: number): Promise<AxiosResponse> => {
  const response = await instance.delete(`${API_URL}${id}/`);
  return response;
};

const updateImageCaption = async (
  id: number,
  updatedObject: ImageUpdateObject,
): Promise<PostType> => {
  const response = await instance.patch(`${API_URL}${id}/`, updatedObject);
  return response.data;
};

const updateImage = async (updatedImage: PostType): Promise<PostType> => {
  const response = await instance.put(
    `${API_URL}${updatedImage.id}/`,
    updatedImage,
  );
  return response.data;
};

export default {
  getAll,
  getById,
  create,
  deleteImage,
  updateImage,
  updateImageCaption,
};
