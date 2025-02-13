import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppDispatch} from '../../../redux/store/store';
import {refreshAccessToken} from '../refreshToken';
import {logoutUser} from '../../../redux/slices/userSlice';

const refreshTokenHandler = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.warn('No refresh token found, logging out user.');
      dispatch(logoutUser());
      return;
    }

    const data = await refreshAccessToken(refreshToken);

    await AsyncStorage.setItem('accessToken', data.accessToken);
  } catch (error) {
    console.error('Error refreshing token:', error);
    dispatch(logoutUser());
  }
};

export default refreshTokenHandler;
