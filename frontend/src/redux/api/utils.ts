//export const API_URL = 'http://localhost:8000/api/auth/';
import {Platform} from 'react-native';

import {HOST} from '../../../localVariables';

export const API_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:8000/api/'
    : `http://${HOST}:8000/api/`;
