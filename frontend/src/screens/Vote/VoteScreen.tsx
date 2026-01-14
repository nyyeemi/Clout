import React from 'react';
import {Dimensions, View} from 'react-native';

import {faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {ThemedIcon, Title1Text} from '../../components/ui/typography';
import {Routes, VoteStackParamList} from '../../navigation/Routes';
import {useGetCurrentCompetitionQuery} from '../../redux/api/endpoints/competitions';
import {VotePair} from './VotePair';

const {height} = Dimensions.get('window');

export const VoteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<VoteStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight();
  const {data: competitionData} = useGetCurrentCompetitionQuery('voting');

  return (
    <ThemedSafeAreaView style={{flex: 1}}>
      <View
        style={{
          maxHeight: (height - tabBarHeight) / 6,
          flex: 1,
          marginHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 20,
        }}>
        <Title1Text style={{fontWeight: 'bold', lineHeight: 40, fontSize: 40}}>
          {competitionData?.competition.category}
        </Title1Text>
        <OpacityPressable
          style={{marginTop: 6}}
          onPress={() => navigation.navigate(Routes.Info)}>
          <ThemedIcon icon={faCircleInfo} />
        </OpacityPressable>
      </View>
      <VotePair />
    </ThemedSafeAreaView>
  );
};
