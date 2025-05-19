import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import globalStyle from '../assets/styles/globalStyle';
import {ThemedView} from '../components/ui/themed-view';
import {RootState} from '../redux/store/store';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {BottomTabNavigator} from './BottomTabNavigator';
import {RootStackParamList, Routes} from './Routes';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  /*
  const dispatch = useDispatch();
  useEffect(() => {
    const data = {user: mockUser, accessToken: 'lol', refreshToken: 'lol'};
    dispatch(setCredentials(data));
    setLoading(false);
  }, [dispatch]);
*/
  const token = useSelector((state: RootState) => state.auth.accessToken);

  return (
    <ThemedView style={globalStyle.flex}>
      {token ? <AppStack /> : <AuthStack />}
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
