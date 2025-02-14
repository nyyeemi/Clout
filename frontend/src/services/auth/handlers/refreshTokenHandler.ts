import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {AppDispatch} from '../../../redux/store/store';
import {refreshAccessToken} from '../refreshToken';
import {logoutUser} from '../../../redux/slices/userSlice';
import axios from 'axios';
import {errorHandler} from './errorHandler';

const refreshTokenHandler = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.warn('No refresh token found, logging out user.');
      Alert.alert('Session Expired.');
      dispatch(logoutUser());
      return;
    }

    const data = await refreshAccessToken(refreshToken);

    await AsyncStorage.setItem('accessToken', data.accessToken);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorHandler(error, 'RefreshTokenHandler error');
      Alert.alert('Session Expired.');
    } else if (error instanceof Error) {
      errorHandler(error, 'RefreshTokenHandler error');
      Alert.alert('Session Expired.');
    } else {
      errorHandler(error, 'RefreshTokenHandler error');
      Alert.alert('Session Expired.');
    }

    dispatch(logoutUser());
  }
};

export default refreshTokenHandler;
