import React from 'react';
import {useSelector} from 'react-redux';
import {Authenticated, NonAuthenticated} from './MainNavigation';
import {RootState} from '../redux/store/store';

export const RootNavigation = () => {
  const user = useSelector((state: RootState) => state.user);

  //return user.isAuthenticated ? <Authenticated /> : <NonAuthenticated />;
  return <Authenticated />;
};
