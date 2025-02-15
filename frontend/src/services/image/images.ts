import {Platform} from 'react-native';
import {HOST} from '../../../localVariables';

import axios from 'axios';
import {getAccessToken} from '../utils';

export const API_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:8000/api/images/'
    : `http://${HOST}:8000/api/images/`;

export interface CustomImage {
  id: number;
  user_id: number;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  created_at: string;
  is_visible: boolean;
}

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

const create = async (image_url: string): Promise<CustomImage> => {
  const response = await instance.post<CustomImage>(API_URL, {image_url});
  return response.data;
};

export default {getAll, create};
