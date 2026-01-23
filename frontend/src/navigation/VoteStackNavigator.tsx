import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {useTheme} from '../hooks/useTheme';
import {CompetitionInfoScreen} from '../screens/Vote/CompetitionInfoScreen';
import {VoteScreen} from '../screens/Vote/VoteScreen';
import {VoteStackParamList} from './Routes';

const VoteStack = createStackNavigator<VoteStackParamList>();

export const VoteStackNavigator = () => {
  const theme = useTheme();
  return (
    <VoteStack.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          display: 'none', //route.name === 'Vertical' ? 'none' : 'flex',
        },
      })}>
      <VoteStack.Screen name={'Vote'} component={VoteScreen} />
      <VoteStack.Screen
        name={'Info'}
        component={CompetitionInfoScreen}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: theme.colors.background},
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </VoteStack.Navigator>
  );
};
