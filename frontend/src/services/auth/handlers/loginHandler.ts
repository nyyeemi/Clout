import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginService from '../../../services/auth/login';
import {loginUser} from '../../../redux/slices/userSlice';
import {AppDispatch} from '../../../redux/store/store';
import {loginErrorHandler} from './errorHandlers/loginErrorHandler';

export const loginHandler = async (
  username: string,
  password: string,
  dispatch: AppDispatch,
  setLoading: (loading: boolean) => void,
) => {
  if (!username || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  try {
    setLoading(true);
    const data = await loginService.login(username, password);
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);

    dispatch(loginUser(data));

    Alert.alert('Login Successful', 'Welcome back!');
  } catch (error: unknown) {
    loginErrorHandler(error, 'LoginHandler error');
    Alert.alert('Login failed.');
  } finally {
    setLoading(false);
  }
};
