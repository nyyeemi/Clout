import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {LeaderboardScreen} from '../screens/LeaderboardScreen/LeaderboardScreen';
import {ProfileStackNavigator} from './ProfileStackNavigator';
import {LeaderboardStackParamList, Routes} from './Routes';

const LeaderboardStack = createStackNavigator<LeaderboardStackParamList>();

export const LeaderboardStackNavigator = () => {
  return (
    <LeaderboardStack.Navigator screenOptions={{headerShown: false}}>
      <LeaderboardStack.Screen
        name={Routes.Leaderboard}
        component={LeaderboardScreen}
      />
      <LeaderboardStack.Screen
        name={Routes.ProfileStack}
        component={ProfileStackNavigator}
      />
    </LeaderboardStack.Navigator>
  );
};
