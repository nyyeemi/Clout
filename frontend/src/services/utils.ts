import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';
import {HOST} from '../../localVariables';

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};

export const setAccessToken = async (accessToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (error) {
    console.error('Error retrieving token', error);
  }
};

export const API_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:8000/api/'
    : `http://${HOST}:8000/api/`;

const instance = axios.create({
  baseURL: API_URL,
});
// more on axios interceptors: https://medium.com/@barisberkemalkoc/axios-interceptor-intelligent-db46653b7303
instance.interceptors.request.use(async config => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default instance;
