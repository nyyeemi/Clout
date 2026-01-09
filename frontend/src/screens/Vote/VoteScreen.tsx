import React from 'react';
import {Dimensions, View} from 'react-native';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {ThemedText, Title1Text} from '../../components/ui/typography';
import {VoteStackParamList} from '../../navigation/Routes';
import {CompetitionInfo} from './CompetitionInfo';
import {VotePair} from './VotePair';

const {height} = Dimensions.get('window');

export const VoteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<VoteStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <ThemedSafeAreaView style={{flex: 1}}>
      <View
        style={{
          maxHeight: (height - tabBarHeight) / 6,
          //backgroundColor: 'red',
          flex: 1,
        }}>
        <Title1Text style={{fontWeight: 'bold'}}>Voting</Title1Text>
        <OpacityPressable>
          <ThemedText>Navigation to info</ThemedText>{' '}
        </OpacityPressable>
      </View>
      <VotePair />
    </ThemedSafeAreaView>
  );
};
