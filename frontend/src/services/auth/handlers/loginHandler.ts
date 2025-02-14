import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '../../../services/auth/login';
import {loginUser} from '../../../redux/slices/userSlice';
import {AppDispatch} from '../../../redux/store/store';
import {errorHandler} from './errorHandler';

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
    const data = await login(username, password);
    console.log(data);
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);

    dispatch(loginUser(data));

    Alert.alert('Login Successful', 'Welcome back!');
  } catch (error: unknown) {
    errorHandler(error, 'LoginHandler error');
    Alert.alert('Login failed.');
  } finally {
    setLoading(false);
  }
};
