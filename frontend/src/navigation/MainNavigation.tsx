import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootStackParamList, Routes} from './Routes';
import {HomeScreen} from '../screens/Home/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {NavigationBar} from '../components/NavigationBar/NavigationBar';
import {LeaderboardScreen} from '../screens/LeaderboardScreen/LeaderboardScreen';
import {VoteScreen} from '../screens/Vote/VoteScreen';
import {CameraScreen} from '../screens/Camera/CameraScreen';
import {FeedScreen} from '../screens/Feed/FeedScreen';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomTabNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{headerShown: false, tabBarStyle: {display: 'none'}}}>
        <Tab.Screen name={Routes.Home} component={HomeScreen} />
        <Tab.Screen name={Routes.Leaderboard} component={LeaderboardScreen} />
        <Tab.Screen name={Routes.Vote} component={VoteScreen} />
        <Tab.Screen name={Routes.Camera} component={CameraScreen} />
        <Tab.Screen name={Routes.Feed} component={FeedScreen} />
        <Tab.Screen name={Routes.Profile} component={ProfileScreen} />
      </Tab.Navigator>
    </>
  );
};

// Screens for unauthenticated users
export const NonAuthenticated = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Profile}
      screenOptions={{header: () => null, headerShown: false}}>
      <Stack.Screen name={Routes.Profile} component={ProfileScreen} />
      <Stack.Screen name={Routes.Register} component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Screens for authenticated users
export const Authenticated = (): JSX.Element => {
  return (
    <>
      <Stack.Navigator screenOptions={{header: () => null, headerShown: false}}>
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
      </Stack.Navigator>
      <NavigationBar />
    </>
  );
};
