import {Platform} from 'react-native';
import {HOST} from '../../../localVariables';

import axios, {AxiosResponse} from 'axios';
import {getAccessToken} from '../utils';
import {CustomImage} from '../../types/types';

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

const getAll = async (): Promise<CustomImage[]> => {
  const response = await instance.get<CustomImage[]>(API_URL);
  return response.data;
};

const getById = async (id: number): Promise<CustomImage> => {
  const response = await instance.get<CustomImage>(`${API_URL}${id}/`);
  return response.data;
};

const create = async (image_url: string): Promise<CustomImage> => {
  const response = await instance.post<CustomImage>(API_URL, {image_url});
  return response.data;
};

const deleteImage = async (id: number): Promise<AxiosResponse> => {
  const response = await instance.delete(`${API_URL}${id}/`);
  return response;
};

const updateImageCaption = async (
  id: number,
  updatedObject: ImageUpdateObject,
): Promise<CustomImage> => {
  const response = await instance.patch(`${API_URL}${id}/`, updatedObject);
  return response.data;
};

const updateImage = async (updatedImage: CustomImage): Promise<CustomImage> => {
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
