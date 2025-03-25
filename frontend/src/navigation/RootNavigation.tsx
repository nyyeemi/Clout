import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';
import {loginUser} from '../redux/slices/userSlice';
import {ThemedView} from '../components/ui/themed-view';
import globalStyle from '../assets/styles/globalStyle';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {BottomTabNavigator} from './BottomTabNavigator';
import {RootStackParamList, Routes} from './Routes';
import {mockUser} from '../screens/Feed/mock';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    const data = {user: mockUser, accessToken: 'lol', refreshToken: 'lol'};
    dispatch(loginUser(data));
    setLoading(false);
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user);
  if (loading) {
    return <></>;
  }
  return (
    <ThemedView style={globalStyle.flex}>
      {user.isAuthenticated ? <AppStack /> : <AuthStack />}
    </ThemedView>
  );
};

const AuthStack = () => (
  <RootStack.Navigator screenOptions={{headerShown: false}}>
    <RootStack.Screen name={Routes.Login} component={LoginScreen} />
    <RootStack.Screen name={Routes.Register} component={RegisterScreen} />
  </RootStack.Navigator>
);

const AppStack = () => (
  <RootStack.Navigator screenOptions={{headerShown: false}}>
    <RootStack.Screen
      name="BottomTabNavigator"
      component={BottomTabNavigator}
    />
  </RootStack.Navigator>
);
