import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {CompetitionInfoScreen} from '../screens/Vote/CompetitionInfoScreen';
import {PairwiseScreenVertical} from '../screens/Vote/PairwiseScreenVertical';
import {VotePair} from '../screens/Vote/VotePair';
import {VoteScreen} from '../screens/Vote/VoteScreen';
import {VoteStackParamList} from './Routes';

const VoteStack = createNativeStackNavigator<VoteStackParamList>();

export const VoteStackNavigator = () => {
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
        options={{headerShown: true}}
      />

      {/*<VoteStack.Screen
        name={'Vertical'}
        component={PairwiseScreenVertical}
        //options={{tabBarStyle: {display: 'none'}}}
      />*/}
    </VoteStack.Navigator>
  );
};
