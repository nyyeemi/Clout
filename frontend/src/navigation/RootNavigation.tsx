import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Authenticated, NonAuthenticated} from './MainNavigation';
import {RootState} from '../redux/store/store';
import {loginUser} from '../redux/slices/userSlice';
import {mockUser} from '../screens/Profile/mocks';

export const RootNavigation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const data = {user: mockUser, accessToken: 'lol', refreshToken: 'lol'};
    dispatch(loginUser(data));
  }, [dispatch]);
  //return <Authenticated />;
  const user = useSelector((state: RootState) => state.user);
  return user.isAuthenticated ? <Authenticated /> : <NonAuthenticated />;
};
