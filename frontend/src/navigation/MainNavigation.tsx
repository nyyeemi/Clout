import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Routes} from './Routes';
import {HomeScreen} from '../screens/Home/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {NavigationBar} from '../components/NavigationBar/NavigationBar';

const Stack = createStackNavigator();

// Näkymä, jossa käyttäjä ei ole kirjautunut
export const NonAuthenticated = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Login}
      screenOptions={{header: () => null, headerShown: false}}>
      <Stack.Screen name={Routes.Login} component={LoginScreen} />
      <Stack.Screen name={Routes.Register} component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Näkymä, jossa käyttäjä on kirjautunut
export const Authenticated = (): JSX.Element => {
  return (
    <>
      <Stack.Navigator
        initialRouteName={Routes.Home}
        screenOptions={{header: () => null, headerShown: false}}>
        <Stack.Screen name={Routes.Home} component={HomeScreen} />
      </Stack.Navigator>
      {/*TODO: Not sure if navigation bar should be here?? */}
      <NavigationBar />
    </>
  );
};
