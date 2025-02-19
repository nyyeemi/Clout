import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Routes} from './Routes';
import {HomeScreen} from '../screens/Home/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {NavigationBar} from '../components/NavigationBar/NavigationBar';
import {LeaderboardScreen} from '../screens/LeaderboardScreen/LeaderboardScreen';
import {VoteScreen} from '../screens/Vote/VoteScreen';
import {CameraScreen} from '../screens/Camera/CameraScreen';
import {FeedScreen} from '../screens/Feed/FeedScreen';

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
        <Stack.Screen name={Routes.Leaderboard} component={LeaderboardScreen} />
        <Stack.Screen name={Routes.Vote} component={VoteScreen} />
        <Stack.Screen name={Routes.Camera} component={CameraScreen} />
        <Stack.Screen name={Routes.Feed} component={FeedScreen} />
        {/*<Stack.Screen name={Routes.Profile} component={ProfileScreen} />*/}
      </Stack.Navigator>
      {/*TODO: Not sure if navigation bar should be here?? */}
      <NavigationBar />
    </>
  );
};
